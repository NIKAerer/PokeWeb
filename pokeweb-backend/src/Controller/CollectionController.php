<?php

namespace App\Controller;

use App\Dto\NicknameRequest;
use App\Entity\PokemonUser;
use App\Entity\User;
use App\Repository\PokemonRepository;
use App\Repository\PokemonUserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * La collection du joueur connecté : voir, renommer et relâcher ses Pokémon.
 */
#[Route('/api/collection')]
class CollectionController extends AbstractController
{
    public function __construct(
        private readonly PokemonUserRepository $pokemonUserRepository,
        private readonly EntityManagerInterface $em,
    ) {
    }

    #[Route('', name: 'api_collection_list', methods: ['GET'])]
    public function list(#[CurrentUser] User $user, PokemonRepository $pokemonRepository): JsonResponse
    {
        $captures = $this->pokemonUserRepository->findCollectionOf($user);

        return $this->json([
            'discovered' => $this->pokemonUserRepository->countDiscoveredSpecies($user),
            'pokedexSize' => $pokemonRepository->count(),
            'pokemons' => array_map($this->present(...), $captures),
        ]);
    }

    #[Route('/{id}', name: 'api_collection_rename', methods: ['PATCH'])]
    public function rename(
        #[CurrentUser] User $user,
        int $id,
        #[MapRequestPayload] NicknameRequest $request,
    ): JsonResponse {
        $capture = $this->findOwnCapture($user, $id);
        if ($capture === null) {
            return $this->notFound();
        }

        $nickname = trim($request->nickname ?? '');
        $capture->setNickname($nickname === '' ? null : $nickname);
        $this->em->flush();

        return $this->json($this->present($capture));
    }

    #[Route('/{id}', name: 'api_collection_release', methods: ['DELETE'])]
    public function release(#[CurrentUser] User $user, int $id): JsonResponse
    {
        $capture = $this->findOwnCapture($user, $id);
        if ($capture === null) {
            return $this->notFound();
        }

        $this->em->remove($capture);
        $this->em->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * On cherche la capture parmi celles du joueur : impossible de modifier
     * le Pokémon d'un autre joueur en changeant l'id dans l'URL.
     */
    private function findOwnCapture(User $user, int $id): ?PokemonUser
    {
        return $this->pokemonUserRepository->findOneBy(['id' => $id, 'user' => $user]);
    }

    private function notFound(): JsonResponse
    {
        return $this->json(['error' => 'Ce Pokémon n\'est pas dans ta collection.'], Response::HTTP_NOT_FOUND);
    }

    private function present(PokemonUser $capture): array
    {
        $pokemon = $capture->getPokemon();

        return [
            'id' => $capture->getId(),
            'nickname' => $capture->getNickname(),
            'capturedAt' => $capture->getCapturedAt()->format(\DATE_ATOM),
            'pokemon' => [
                'id' => $pokemon->getId(),
                'name' => $pokemon->getName(),
                'type1' => $pokemon->getType1(),
                'type2' => $pokemon->getType2(),
                'legendary' => $pokemon->isLegendary(),
            ],
        ];
    }
}
