<?php

namespace App\Tests\Service;

use App\Entity\Encounter;
use App\Entity\Pokemon;
use App\Entity\EncounterStatus;
use App\Entity\User;
use App\Repository\EncounterRepository;
use App\Repository\PokemonRepository;
use App\Service\BattleService;
use App\Service\CaptureService;
use App\Tests\PokemonFactory;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

/**
 * Tests unitaires des règles de capture : pas de base de données,
 * les dépendances sont remplacées par des "stubs" qui ne font rien.
 */
class CaptureServiceTest extends TestCase
{
    private CaptureService $service;

    protected function setUp(): void
    {
        $this->service = new CaptureService(
            $this->createStub(EntityManagerInterface::class),
            $this->createStub(EncounterRepository::class),
            $this->createStub(PokemonRepository::class),
        );
    }

    public function testWeakPokemonIsEasyButNeverCertain(): void
    {
        // Chenipan est très faible : la chance est plafonnée à 80 %
        $this->assertSame(0.8, $this->service->baseCaptureChance(PokemonFactory::chenipan()));
    }

    public function testStrongerPokemonIsHarderToCatch(): void
    {
        $salameche = $this->service->baseCaptureChance(PokemonFactory::salameche());

        $this->assertEqualsWithDelta(0.685, $salameche, 0.001);
        $this->assertLessThan($this->service->baseCaptureChance(PokemonFactory::chenipan()), $salameche);
    }

    public function testLegendaryKeepsAMinimumChance(): void
    {
        // Mewtwo est légendaire et très fort : on garde quand même 5 %
        $this->assertSame(0.05, $this->service->baseCaptureChance(PokemonFactory::mewtwo()));
    }

    public function testWeakeningTheWildPokemonRaisesTheChance(): void
    {
        $pokemon = PokemonFactory::salameche();
        $encounter = $this->newEncounter($pokemon);
        $this->assertSame(0.69, $this->service->captureChance($encounter));

        // On lui retire un quart de ses PV (138 → 104) : 0.685 × (2 − 104/138) ≈ 0.85
        $encounter->damageWild(intdiv(BattleService::maxHp($pokemon), 4));

        $this->assertSame(0.85, $this->service->captureChance($encounter));
    }

    public function testSuccessfulThrowCatchesThePokemon(): void
    {
        $encounter = $this->newEncounter(PokemonFactory::salameche());

        // Un tirage de 0 est toujours inférieur à la chance de capture
        $capture = $this->service->throwBall($encounter, roll: 0.0);

        $this->assertNotNull($capture);
        $this->assertSame('Salamèche', $capture->getPokemon()->getName());
        $this->assertSame(EncounterStatus::Caught, $encounter->getStatus());
    }

    public function testPokemonFleesAfterThreeMissedBalls(): void
    {
        $encounter = $this->newEncounter(PokemonFactory::salameche());

        // Un tirage de 0.99 rate toujours (la chance ne dépasse jamais 90 %)
        $this->assertNull($this->service->throwBall($encounter, roll: 0.99));
        $this->assertNull($this->service->throwBall($encounter, roll: 0.99));
        $this->assertSame(EncounterStatus::Active, $encounter->getStatus());

        $this->assertNull($this->service->throwBall($encounter, roll: 0.99));
        $this->assertSame(0, $encounter->getBallsLeft());
        $this->assertSame(EncounterStatus::Fled, $encounter->getStatus());
    }

    private function newEncounter(Pokemon $pokemon): Encounter
    {
        return new Encounter(new User(), $pokemon, CaptureService::BALLS_PER_ENCOUNTER, BattleService::maxHp($pokemon));
    }
}
