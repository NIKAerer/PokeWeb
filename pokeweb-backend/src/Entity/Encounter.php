<?php

namespace App\Entity;

use App\Repository\EncounterRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Une rencontre entre un joueur et un Pokémon sauvage.
 *
 * Elle est enregistrée en base pour que tout se décide côté serveur :
 * le joueur ne peut pas choisir le Pokémon ni tricher sur le résultat.
 */
#[ORM\Entity(repositoryClass: EncounterRepository::class)]
class Encounter
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

    #[ORM\Column]
    private int $ballsLeft;

    // Points de vie actuels du Pokémon sauvage : plus il est affaibli, plus il est facile à capturer
    #[ORM\Column]
    private int $wildHp;

    // Le Pokémon que le joueur a envoyé combattre (optionnel)
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(onDelete: 'SET NULL')]
    private ?PokemonUser $fighter = null;

    #[ORM\Column(nullable: true)]
    private ?int $fighterHp = null;

    #[ORM\Column(length: 20, enumType: EncounterStatus::class)]
    private EncounterStatus $status = EncounterStatus::Active;

    #[ORM\Column]
    private \DateTimeImmutable $startedAt;

    public function __construct(User $user, Pokemon $pokemon, int $balls, int $wildHp)
    {
        $this->user = $user;
        $this->pokemon = $pokemon;
        $this->ballsLeft = $balls;
        $this->wildHp = $wildHp;
        $this->startedAt = new \DateTimeImmutable();
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

    public function getBallsLeft(): int
    {
        return $this->ballsLeft;
    }

    public function useBall(): void
    {
        --$this->ballsLeft;
    }

    public function getWildHp(): int
    {
        return $this->wildHp;
    }

    public function damageWild(int $damage): void
    {
        $this->wildHp = max(0, $this->wildHp - $damage);
    }

    public function getFighter(): ?PokemonUser
    {
        return $this->fighter;
    }

    public function setFighter(PokemonUser $fighter, int $hp): void
    {
        $this->fighter = $fighter;
        $this->fighterHp = $hp;
    }

    public function getFighterHp(): ?int
    {
        return $this->fighterHp;
    }

    public function damageFighter(int $damage): void
    {
        $this->fighterHp = max(0, $this->fighterHp - $damage);
    }

    /**
     * Le joueur peut attaquer si son Pokémon est en jeu et n'est pas K.O.
     */
    public function canAttack(): bool
    {
        return $this->isActive() && $this->fighter !== null && $this->fighterHp > 0;
    }

    public function getStatus(): EncounterStatus
    {
        return $this->status;
    }

    public function setStatus(EncounterStatus $status): void
    {
        $this->status = $status;
    }

    public function isActive(): bool
    {
        return $this->status === EncounterStatus::Active;
    }

    public function getStartedAt(): \DateTimeImmutable
    {
        return $this->startedAt;
    }
}
