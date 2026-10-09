<?php

namespace App\Controller;

use App\Dto\FighterRequest;
use App\Entity\Encounter;
use App\Entity\User;
use App\Repository\EncounterRepository;
use App\Repository\PokemonUserRepository;
use App\Service\BattleService;
use App\Service\CaptureService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
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
        private readonly BattleService $battleService,
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

    /**
     * Envoie un Pokémon de la collection combattre le Pokémon sauvage.
     */
    #[Route('/fighter', name: 'api_encounter_fighter', methods: ['POST'])]
    public function chooseFighter(
        #[CurrentUser] User $user,
        #[MapRequestPayload] FighterRequest $request,
        PokemonUserRepository $pokemonUserRepository,
    ): JsonResponse {
        $encounter = $this->encounterRepository->findActiveFor($user);
        if ($encounter === null) {
            return $this->noEncounter();
        }
        if ($encounter->getFighter() !== null) {
            return $this->json(['error' => 'Un Pokémon combat déjà.'], Response::HTTP_CONFLICT);
        }

        // Le combattant doit appartenir au joueur
        $fighter = $pokemonUserRepository->findOneBy(['id' => $request->captureId, 'user' => $user]);
        if ($fighter === null) {
            return $this->json(['error' => 'Ce Pokémon n\'est pas dans ta collection.'], Response::HTTP_NOT_FOUND);
        }

        $this->battleService->chooseFighter($encounter, $fighter);

        return $this->json($this->present($user, $encounter));
    }

    /**
     * Joue un tour de combat.
     */
    #[Route('/attack', name: 'api_encounter_attack', methods: ['POST'])]
    public function attack(#[CurrentUser] User $user): JsonResponse
    {
        $encounter = $this->encounterRepository->findActiveFor($user);
        if ($encounter === null) {
            return $this->noEncounter();
        }
        if (!$encounter->canAttack()) {
            return $this->json(['error' => 'Aucun Pokémon en état de combattre.'], Response::HTTP_CONFLICT);
        }

        $log = $this->battleService->playRound($encounter);

        return $this->json(['log' => $log, ...$this->present($user, $encounter)]);
    }

    #[Route('/throw', name: 'api_encounter_throw', methods: ['POST'])]
    public function throwBall(#[CurrentUser] User $user): JsonResponse
    {
        $encounter = $this->encounterRepository->findActiveFor($user);
        if ($encounter === null) {
            return $this->noEncounter();
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

    private function noEncounter(): JsonResponse
    {
        return $this->json(['error' => 'Aucun Pokémon sauvage en vue.'], Response::HTTP_NOT_FOUND);
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

        if ($encounter === null) {
            return $data;
        }

        $pokemon = $encounter->getPokemon();
        $data['encounter'] = [
            'status' => $encounter->getStatus()->value,
            'ballsLeft' => $encounter->getBallsLeft(),
            'captureChance' => $this->captureService->captureChance($encounter),
            'pokemon' => [
                'id' => $pokemon->getId(),
                'name' => $pokemon->getName(),
                'type1' => $pokemon->getType1(),
                'type2' => $pokemon->getType2(),
                'legendary' => $pokemon->isLegendary(),
                'hp' => $encounter->getWildHp(),
                'maxHp' => BattleService::maxHp($pokemon),
            ],
            'fighter' => null,
        ];

        $fighter = $encounter->getFighter();
        if ($fighter !== null) {
            $data['encounter']['fighter'] = [
                'captureId' => $fighter->getId(),
                'id' => $fighter->getPokemon()->getId(),
                'name' => $fighter->getNickname() ?? $fighter->getPokemon()->getName(),
                'type1' => $fighter->getPokemon()->getType1(),
                'type2' => $fighter->getPokemon()->getType2(),
                'hp' => $encounter->getFighterHp(),
                'maxHp' => BattleService::maxHp($fighter->getPokemon()),
            ];
        }

        return $data;
    }
}
