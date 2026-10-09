<?php

namespace App\Tests;

use App\Entity\Pokemon;

/**
 * Crée des Pokémon pour les tests, sans passer par le fichier CSV.
 */
final class PokemonFactory
{
    /**
     * @param array{hp?: int, attack?: int, defense?: int, specialAttack?: int, specialDefense?: int, speed?: int} $stats
     */
    public static function create(
        int $id,
        string $name,
        string $type1,
        ?string $type2 = null,
        array $stats = [],
        bool $legendary = false,
    ): Pokemon {
        return (new Pokemon())
            ->setId($id)
            ->setName($name)
            ->setEnglishName($name)
            ->setCategory('Pokémon de test')
            ->setType1($type1)
            ->setType2($type2)
            ->setHp($stats['hp'] ?? 50)
            ->setAttack($stats['attack'] ?? 50)
            ->setDefense($stats['defense'] ?? 50)
            ->setSpecialAttack($stats['specialAttack'] ?? 50)
            ->setSpecialDefense($stats['specialDefense'] ?? 50)
            ->setSpeed($stats['speed'] ?? 50)
            ->setGeneration(1)
            ->setLegendary($legendary)
            ->setDescription('Un Pokémon créé pour les tests.');
    }

    // Quelques vrais Pokémon avec leurs statistiques officielles

    public static function chenipan(): Pokemon
    {
        return self::create(10, 'Chenipan', 'bug', null, ['hp' => 45, 'attack' => 30, 'defense' => 35, 'specialAttack' => 20, 'specialDefense' => 20, 'speed' => 45]);
    }

    public static function salameche(): Pokemon
    {
        return self::create(4, 'Salamèche', 'fire', null, ['hp' => 39, 'attack' => 52, 'defense' => 43, 'specialAttack' => 60, 'specialDefense' => 50, 'speed' => 65]);
    }

    public static function bulbizarre(): Pokemon
    {
        return self::create(1, 'Bulbizarre', 'grass', 'poison', ['hp' => 45, 'attack' => 49, 'defense' => 49, 'specialAttack' => 65, 'specialDefense' => 65, 'speed' => 45]);
    }

    public static function mewtwo(): Pokemon
    {
        return self::create(150, 'Mewtwo', 'psychic', null, ['hp' => 106, 'attack' => 110, 'defense' => 90, 'specialAttack' => 154, 'specialDefense' => 90, 'speed' => 130], true);
    }
}
