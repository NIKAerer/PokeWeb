<?php

namespace App\Controller;

use App\Entity\Encounter;
use App\Entity\User;
use App\Repository\EncounterRepository;
use App\Service\CaptureService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Rencontres avec les Pokémon sauvages. Un joueur a au plus une rencontre en cours.
 */
#[Route('/api/encounter')]
class EncounterController extends AbstractController
{
    public function __construct(
        private readonly CaptureService $captureService,
        private readonly EncounterRepository $encounterRepository,
    ) {
    }

    /**
     * Rencontre en cours (ou null) et nombre de rencontres restantes aujourd'hui.
     */
    #[Route('', name: 'api_encounter_current', methods: ['GET'])]
    public function current(#[CurrentUser] User $user): JsonResponse
    {
        return $this->json($this->present($user, $this->encounterRepository->findActiveFor($user)));
    }

    /**
     * Fait apparaître un Pokémon sauvage (ou renvoie celui déjà présent).
     */
    #[Route('', name: 'api_encounter_start', methods: ['POST'])]
    public function start(#[CurrentUser] User $user): JsonResponse
    {
        $encounter = $this->encounterRepository->findActiveFor($user)
            ?? $this->captureService->startEncounter($user);

        if ($encounter === null) {
            return $this->json(
                ['error' => 'Tu as utilisé toutes tes rencontres du jour. Reviens demain !'],
                Response::HTTP_TOO_MANY_REQUESTS,
            );
        }

        return $this->json($this->present($user, $encounter));
    }

    #[Route('/throw', name: 'api_encounter_throw', methods: ['POST'])]
    public function throwBall(#[CurrentUser] User $user): JsonResponse
    {
        $encounter = $this->encounterRepository->findActiveFor($user);
        if ($encounter === null) {
            return $this->json(['error' => 'Aucun Pokémon sauvage en vue.'], Response::HTTP_NOT_FOUND);
        }

        $capture = $this->captureService->throwBall($encounter);

        return $this->json([
            'caught' => $capture !== null,
            'captureId' => $capture?->getId(),
            ...$this->present($user, $encounter),
        ]);
    }

    #[Route('/flee', name: 'api_encounter_flee', methods: ['POST'])]
    public function flee(#[CurrentUser] User $user): JsonResponse
    {
        $encounter = $this->encounterRepository->findActiveFor($user);
        if ($encounter !== null) {
            $this->captureService->flee($encounter);
        }

        return $this->json($this->present($user, null));
    }

    /**
     * Données envoyées au front pour afficher la rencontre.
     */
    private function present(User $user, ?Encounter $encounter): array
    {
        $data = [
            'encountersLeftToday' => $this->captureService->encountersLeftToday($user),
            'encounter' => null,
        ];

        if ($encounter !== null) {
            $pokemon = $encounter->getPokemon();
            $data['encounter'] = [
                'status' => $encounter->getStatus()->value,
                'ballsLeft' => $encounter->getBallsLeft(),
                'captureChance' => $this->captureService->captureChance($pokemon),
                'pokemon' => [
                    'id' => $pokemon->getId(),
                    'name' => $pokemon->getName(),
                    'type1' => $pokemon->getType1(),
                    'type2' => $pokemon->getType2(),
                    'legendary' => $pokemon->isLegendary(),
                ],
            ];
        }

        return $data;
    }
}
