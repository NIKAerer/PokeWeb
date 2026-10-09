<?php

namespace App\Tests\Service;

use App\Entity\Encounter;
use App\Entity\EncounterStatus;
use App\Entity\PokemonUser;
use App\Entity\User;
use App\Service\BattleService;
use App\Tests\PokemonFactory;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class BattleServiceTest extends TestCase
{
    private BattleService $service;

    protected function setUp(): void
    {
        $this->service = new BattleService($this->createStub(EntityManagerInterface::class));
    }

    public function testMaxHpDependsOnTheHpStat(): void
    {
        // 39 PV × 2 + 60
        $this->assertSame(138, BattleService::maxHp(PokemonFactory::salameche()));
    }

    public function testSuperEffectiveAttackDoesDoubleDamage(): void
    {
        // Salamèche attaque en spécial (60) contre la défense spéciale de Bulbizarre (65).
        // Feu contre Plante/Poison = ×2. Avec un facteur aléatoire fixé à 1 :
        // (22 × 60 × 60 / 65) / 50 + 2 ≈ 26.37, × 2 = 52
        [$damage, $effectiveness] = $this->service->computeDamage(
            PokemonFactory::salameche(),
            PokemonFactory::bulbizarre(),
            randomFactor: 1.0,
        );

        $this->assertSame(2.0, $effectiveness);
        $this->assertSame(52, $damage);
    }

    public function testAttackerUsesItsBestType(): void
    {
        // Bulbizarre (Plante/Poison) contre Salamèche (Feu) :
        // Plante ferait ×0.5, Poison fait ×1 → il choisit Poison.
        [$damage, $effectiveness] = $this->service->computeDamage(
            PokemonFactory::bulbizarre(),
            PokemonFactory::salameche(),
            randomFactor: 1.0,
        );

        $this->assertSame(1.0, $effectiveness);
        $this->assertSame(36, $damage);
    }

    public function testNoDamageWhenTypeHasNoEffect(): void
    {
        $ghost = PokemonFactory::create(92, 'Fantominus', 'ghost', 'poison');
        $normal = PokemonFactory::create(19, 'Rattata', 'normal');

        $this->assertSame([0, 0.0], $this->service->computeDamage($normal, $ghost, randomFactor: 1.0));
    }

    public function testKnockingOutTheWildPokemonEndsTheEncounter(): void
    {
        $wild = PokemonFactory::chenipan();
        $encounter = new Encounter(new User(), $wild, 3, BattleService::maxHp($wild));
        $encounter->damageWild(BattleService::maxHp($wild) - 1); // il ne reste qu'1 PV

        $fighter = new PokemonUser(new User(), PokemonFactory::salameche());
        $this->service->chooseFighter($encounter, $fighter);

        $log = $this->service->playRound($encounter);

        // Salamèche est plus rapide : il attaque en premier et met Chenipan K.O.,
        // donc Chenipan ne riposte pas.
        $this->assertCount(1, $log);
        $this->assertSame('fighter', $log[0]['attacker']);
        $this->assertSame(0, $encounter->getWildHp());
        $this->assertSame(EncounterStatus::Defeated, $encounter->getStatus());
    }
}
