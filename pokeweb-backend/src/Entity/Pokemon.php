<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\PokemonRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Une espèce du Pokédex (721 Pokémon, générations 1 à 6).
 *
 * L'identifiant est le numéro officiel du Pokédex : /api/pokemon/25 = Pikachu.
 * Les données sont en lecture seule et importées avec "app:import-pokemons".
 */
#[ORM\Entity(repositoryClass: PokemonRepository::class)]
#[ApiResource(
    operations: [
        // La liste complète est petite (721 lignes) : on l'envoie en une fois,
        // la recherche et les filtres se font instantanément côté front.
        new GetCollection(paginationEnabled: false, order: ['id' => 'ASC']),
        new Get(),
    ],
)]
class Pokemon
{
    #[ORM\Id]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $name = null;

    #[ORM\Column(length: 50)]
    private ?string $englishName = null;

    #[ORM\Column(length: 50)]
    private ?string $category = null;

    // Types stockés en anglais ("fire", "water"...) : ce sont des clés techniques,
    // le front se charge de les traduire et de leur donner une couleur.
    #[ORM\Column(length: 20)]
    private ?string $type1 = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $type2 = null;

    #[ORM\Column]
    private ?int $hp = null;

    #[ORM\Column]
    private ?int $attack = null;

    #[ORM\Column]
    private ?int $defense = null;

    #[ORM\Column]
    private ?int $specialAttack = null;

    #[ORM\Column]
    private ?int $specialDefense = null;

    #[ORM\Column]
    private ?int $speed = null;

    #[ORM\Column]
    private ?int $generation = null;

    #[ORM\Column]
    private ?bool $legendary = null;

    #[ORM\Column(length: 500)]
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getEnglishName(): ?string
    {
        return $this->englishName;
    }

    public function setEnglishName(string $englishName): static
    {
        $this->englishName = $englishName;

        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getType1(): ?string
    {
        return $this->type1;
    }

    public function setType1(string $type1): static
    {
        $this->type1 = $type1;

        return $this;
    }

    public function getType2(): ?string
    {
        return $this->type2;
    }

    public function setType2(?string $type2): static
    {
        $this->type2 = $type2;

        return $this;
    }

    public function getHp(): ?int
    {
        return $this->hp;
    }

    public function setHp(int $hp): static
    {
        $this->hp = $hp;

        return $this;
    }

    public function getAttack(): ?int
    {
        return $this->attack;
    }

    public function setAttack(int $attack): static
    {
        $this->attack = $attack;

        return $this;
    }

    public function getDefense(): ?int
    {
        return $this->defense;
    }

    public function setDefense(int $defense): static
    {
        $this->defense = $defense;

        return $this;
    }

    public function getSpecialAttack(): ?int
    {
        return $this->specialAttack;
    }

    public function setSpecialAttack(int $specialAttack): static
    {
        $this->specialAttack = $specialAttack;

        return $this;
    }

    public function getSpecialDefense(): ?int
    {
        return $this->specialDefense;
    }

    public function setSpecialDefense(int $specialDefense): static
    {
        $this->specialDefense = $specialDefense;

        return $this;
    }

    public function getSpeed(): ?int
    {
        return $this->speed;
    }

    public function setSpeed(int $speed): static
    {
        $this->speed = $speed;

        return $this;
    }

    /**
     * Somme des 6 statistiques, calculée à la volée (pas stockée en base).
     */
    #[ApiProperty(description: 'Somme des statistiques de base')]
    public function getTotal(): int
    {
        return $this->hp + $this->attack + $this->defense
            + $this->specialAttack + $this->specialDefense + $this->speed;
    }

    public function getGeneration(): ?int
    {
        return $this->generation;
    }

    public function setGeneration(int $generation): static
    {
        $this->generation = $generation;

        return $this;
    }

    public function isLegendary(): ?bool
    {
        return $this->legendary;
    }

    public function setLegendary(bool $legendary): static
    {
        $this->legendary = $legendary;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }
}
