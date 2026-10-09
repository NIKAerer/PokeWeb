<?php

namespace App\Entity;

use App\Repository\PokemonUserRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Un Pokémon capturé par un joueur (une ligne de sa collection).
 *
 * Un joueur peut capturer plusieurs fois la même espèce : chaque capture est une ligne.
 */
#[ORM\Entity(repositoryClass: PokemonUserRepository::class)]
class PokemonUser
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private User $user;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private Pokemon $pokemon;

    #[ORM\Column(length: 30, nullable: true)]
    private ?string $nickname = null;

    #[ORM\Column]
    private \DateTimeImmutable $capturedAt;

    public function __construct(User $user, Pokemon $pokemon)
    {
        $this->user = $user;
        $this->pokemon = $pokemon;
        $this->capturedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getPokemon(): Pokemon
    {
        return $this->pokemon;
    }

    public function getNickname(): ?string
    {
        return $this->nickname;
    }

    public function setNickname(?string $nickname): static
    {
        $this->nickname = $nickname;

        return $this;
    }

    public function getCapturedAt(): \DateTimeImmutable
    {
        return $this->capturedAt;
    }
}
