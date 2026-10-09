<?php

namespace App\Service;

use App\Entity\Encounter;
use App\Entity\EncounterStatus;
use App\Entity\Pokemon;
use App\Entity\PokemonUser;
use App\Entity\User;
use App\Repository\EncounterRepository;
use App\Repository\PokemonRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Les règles du jeu pour rencontrer et capturer un Pokémon sauvage.
 */
class CaptureService
{
    public const ENCOUNTERS_PER_DAY = 15;
    public const BALLS_PER_ENCOUNTER = 3;
    public const LEGENDARY_APPEARANCE_RATE = 0.02; // 2 % des rencontres

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly EncounterRepository $encounterRepository,
        private readonly PokemonRepository $pokemonRepository,
    ) {
    }

    public function encountersLeftToday(User $user): int
    {
        return max(0, self::ENCOUNTERS_PER_DAY - $this->encounterRepository->countStartedToday($user));
    }

    /**
     * Fait apparaître un Pokémon sauvage. Renvoie null si le joueur a déjà
     * utilisé toutes ses rencontres du jour.
     */
    public function startEncounter(User $user): ?Encounter
    {
        if ($this->encountersLeftToday($user) === 0) {
            return null;
        }

        $legendary = $this->randomFloat() < self::LEGENDARY_APPEARANCE_RATE;
        $pokemon = $this->pokemonRepository->findRandom($legendary);

        $encounter = new Encounter($user, $pokemon, self::BALLS_PER_ENCOUNTER);
        $this->em->persist($encounter);
        $this->em->flush();

        return $encounter;
    }

    /**
     * Chance de capture entre 0 et 1 : plus un Pokémon est fort, plus il est difficile.
     *
     * Exemples : Chenipan (total 195) ≈ 80 %, Dracaufeu (534) ≈ 31 %, Mewtwo ≈ 5 %.
     */
    public function captureChance(Pokemon $pokemon): float
    {
        $chance = 1.2 - $pokemon->getTotal() / 600;

        if ($pokemon->isLegendary()) {
            $chance /= 3;
        }

        // On garde toujours une petite chance, et jamais une capture certaine
        return round(max(0.05, min(0.8, $chance)), 2);
    }

    /**
     * Lance une Pokéball. $roll est un nombre aléatoire entre 0 et 1 :
     * il est passé en paramètre pour pouvoir tester le résultat facilement.
     *
     * @return PokemonUser|null le Pokémon capturé, ou null s'il s'est échappé
     */
    public function throwBall(Encounter $encounter, ?float $roll = null): ?PokemonUser
    {
        $roll ??= $this->randomFloat();
        $encounter->useBall();

        if ($roll < $this->captureChance($encounter->getPokemon())) {
            $encounter->setStatus(EncounterStatus::Caught);
            $capture = new PokemonUser($encounter->getUser(), $encounter->getPokemon());
            $this->em->persist($capture);
            $this->em->flush();

            return $capture;
        }

        // Raté : sans Pokéball restante, le Pokémon s'enfuit
        if ($encounter->getBallsLeft() === 0) {
            $encounter->setStatus(EncounterStatus::Fled);
        }
        $this->em->flush();

        return null;
    }

    public function flee(Encounter $encounter): void
    {
        $encounter->setStatus(EncounterStatus::Fled);
        $this->em->flush();
    }

    private function randomFloat(): float
    {
        return random_int(0, PHP_INT_MAX) / PHP_INT_MAX;
    }
}
