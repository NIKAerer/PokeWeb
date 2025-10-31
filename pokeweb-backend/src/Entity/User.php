<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(nullable: true)]
    private ?int $xp = null;

    #[ORM\Column]
    private ?int $level = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    /**
     * @var Collection<int, PokemonUser>
     */
    #[ORM\OneToMany(targetEntity: PokemonUser::class, mappedBy: 'user')]
    private Collection $pokemonUsers;

    public function __construct()
    {
        $this->pokemonUsers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getXp(): ?int
    {
        return $this->xp;
    }

    public function setXp(?int $xp): static
    {
        $this->xp = $xp;

        return $this;
    }

    public function getLevel(): ?int
    {
        return $this->level;
    }

    public function setLevel(int $level): static
    {
        $this->level = $level;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    /**
     * @return Collection<int, PokemonUser>
     */
    public function getPokemonUsers(): Collection
    {
        return $this->pokemonUsers;
    }

    public function addPokemonUser(PokemonUser $pokemonUser): static
    {
        if (!$this->pokemonUsers->contains($pokemonUser)) {
            $this->pokemonUsers->add($pokemonUser);
            $pokemonUser->setUser($this);
        }

        return $this;
    }

    public function removePokemonUser(PokemonUser $pokemonUser): static
    {
        if ($this->pokemonUsers->removeElement($pokemonUser)) {
            // set the owning side to null (unless already changed)
            if ($pokemonUser->getUser() === $this) {
                $pokemonUser->setUser(null);
            }
        }

        return $this;
    }
}
