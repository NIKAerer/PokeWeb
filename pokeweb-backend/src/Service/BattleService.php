<?php

namespace App\Service;

use App\Entity\Encounter;
use App\Entity\EncounterStatus;
use App\Entity\Pokemon;
use App\Entity\PokemonUser;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Un combat simple au tour par tour entre le Pokémon du joueur et le Pokémon sauvage.
 *
 * Inspiré de la formule officielle, simplifiée : tous les Pokémon sont niveau 50
 * et utilisent une attaque de puissance 60 du type qui les avantage le plus.
 */
class BattleService
{
    private const ATTACK_POWER = 60;

    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    /**
     * Points de vie au début d'un combat.
     */
    public static function maxHp(Pokemon $pokemon): int
    {
        return $pokemon->getHp() * 2 + 60;
    }

    /**
     * Le joueur envoie un de ses Pokémon combattre.
     */
    public function chooseFighter(Encounter $encounter, PokemonUser $fighter): void
    {
        $encounter->setFighter($fighter, self::maxHp($fighter->getPokemon()));
        $this->em->flush();
    }

    /**
     * Joue un tour : le plus rapide attaque en premier, puis l'autre s'il tient encore debout.
     *
     * @return list<array{attacker: string, damage: int, effectiveness: float}> ce qui s'est passé
     */
    public function playRound(Encounter $encounter): array
    {
        $fighter = $encounter->getFighter()->getPokemon();
        $wild = $encounter->getPokemon();
        $log = [];

        $fighterFirst = $fighter->getSpeed() >= $wild->getSpeed();
        $order = $fighterFirst ? ['fighter', 'wild'] : ['wild', 'fighter'];

        foreach ($order as $attacker) {
            if ($attacker === 'fighter') {
                [$damage, $effectiveness] = $this->computeDamage($fighter, $wild);
                $encounter->damageWild($damage);
            } else {
                [$damage, $effectiveness] = $this->computeDamage($wild, $fighter);
                $encounter->damageFighter($damage);
            }

            $log[] = ['attacker' => $attacker, 'damage' => $damage, 'effectiveness' => $effectiveness];

            if ($encounter->getWildHp() === 0) {
                // Le Pokémon sauvage est K.O. : il ne peut plus être capturé
                $encounter->setStatus(EncounterStatus::Defeated);
                break;
            }
            if ($encounter->getFighterHp() === 0) {
                break; // notre Pokémon est K.O., il ne peut plus attaquer
            }
        }

        $this->em->flush();

        return $log;
    }

    /**
     * Dégâts d'une attaque. $randomFactor (entre 0.85 et 1) peut être fixé pour les tests.
     *
     * @return array{0: int, 1: float} les dégâts et l'efficacité du type
     */
    public function computeDamage(Pokemon $attacker, Pokemon $defender, ?float $randomFactor = null): array
    {
        // Le Pokémon utilise sa meilleure statistique d'attaque (physique ou spéciale)
        $physical = $attacker->getAttack() >= $attacker->getSpecialAttack();
        $attack = $physical ? $attacker->getAttack() : $attacker->getSpecialAttack();
        $defense = $physical ? $defender->getDefense() : $defender->getSpecialDefense();

        // Il attaque avec celui de ses types qui fait le plus mal
        $effectiveness = TypeChart::effectiveness($attacker->getType1(), $defender->getType1(), $defender->getType2());
        if ($attacker->getType2() !== null) {
            $effectiveness = max(
                $effectiveness,
                TypeChart::effectiveness($attacker->getType2(), $defender->getType1(), $defender->getType2()),
            );
        }

        $randomFactor ??= random_int(85, 100) / 100;

        // Formule officielle au niveau 50 : (2 × 50 / 5 + 2) = 22
        $base = (22 * self::ATTACK_POWER * $attack / $defense) / 50 + 2;
        $damage = (int) floor($base * $effectiveness * $randomFactor);

        // Une attaque qui touche fait toujours au moins 1 dégât
        return [$effectiveness > 0 ? max(1, $damage) : 0, $effectiveness];
    }
}
