<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\PokemonRepository;
use App\Repository\PokemonUserRepository;
use App\Service\CaptureService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Le profil du joueur connecté et ses statistiques.
 */
class ProfileController extends AbstractController
{
    private const RECENT_CAPTURES = 6;

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(
        #[CurrentUser] User $user,
        PokemonUserRepository $pokemonUserRepository,
        PokemonRepository $pokemonRepository,
        CaptureService $captureService,
    ): JsonResponse {
        $captures = $pokemonUserRepository->findCollectionOf($user);

        // On compte les légendaires et les types pour trouver le type préféré
        $legendaries = 0;
        $typeCounts = [];
        foreach ($captures as $capture) {
            $pokemon = $capture->getPokemon();
            if ($pokemon->isLegendary()) {
                ++$legendaries;
            }
            foreach (array_filter([$pokemon->getType1(), $pokemon->getType2()]) as $type) {
                $typeCounts[$type] = ($typeCounts[$type] ?? 0) + 1;
            }
        }
        arsort($typeCounts);

        $recent = array_map(fn ($capture) => [
            'id' => $capture->getId(),
            'nickname' => $capture->getNickname(),
            'pokemon' => [
                'id' => $capture->getPokemon()->getId(),
                'name' => $capture->getPokemon()->getName(),
            ],
        ], array_slice($captures, 0, self::RECENT_CAPTURES));

        return $this->json([
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'createdAt' => $user->getCreatedAt()->format(\DATE_ATOM),
            'stats' => [
                'captures' => count($captures),
                'discovered' => $pokemonUserRepository->countDiscoveredSpecies($user),
                'pokedexSize' => $pokemonRepository->count(),
                'legendaries' => $legendaries,
                'favoriteType' => array_key_first($typeCounts),
                'encountersLeftToday' => $captureService->encountersLeftToday($user),
            ],
            'recentCaptures' => $recent,
        ]);
    }
}
