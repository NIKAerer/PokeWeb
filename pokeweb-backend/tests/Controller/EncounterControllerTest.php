<?php

namespace App\Tests\Controller;

use App\Service\CaptureService;
use App\Tests\ApiTestCase;
use App\Tests\PokemonFactory;

class EncounterControllerTest extends ApiTestCase
{
    public function testStartingAnEncounterUsesOneOfTheDailyEncounters(): void
    {
        // Un Pokémon classique et un légendaire : l'un des deux apparaît
        $this->savePokemon(PokemonFactory::chenipan());
        $this->savePokemon(PokemonFactory::mewtwo());
        $token = $this->tokenFor($this->createUser('Sacha', 'sacha@pokeweb.fr'));

        $data = $this->requestJson('POST', '/api/encounter', token: $token);

        $this->assertStatus(200);
        $this->assertContains($data['encounter']['pokemon']['name'], ['Chenipan', 'Mewtwo']);
        $this->assertSame(CaptureService::ENCOUNTERS_PER_DAY - 1, $data['encountersLeftToday']);
        $this->assertSame(CaptureService::BALLS_PER_ENCOUNTER, $data['encounter']['ballsLeft']);
    }

    public function testNoMoreEncountersAfterTheDailyLimit(): void
    {
        $this->savePokemon(PokemonFactory::chenipan());
        $this->savePokemon(PokemonFactory::mewtwo());
        $token = $this->tokenFor($this->createUser('Sacha', 'sacha@pokeweb.fr'));

        // On fuit chaque rencontre pour en démarrer une nouvelle, jusqu'à la limite
        for ($i = 0; $i < CaptureService::ENCOUNTERS_PER_DAY; ++$i) {
            $this->requestJson('POST', '/api/encounter', token: $token);
            $this->requestJson('POST', '/api/encounter/flee', token: $token);
        }

        $data = $this->requestJson('POST', '/api/encounter', token: $token);

        $this->assertStatus(429);
        $this->assertSame('Tu as utilisé toutes tes rencontres du jour. Reviens demain !', $data['error']);
    }
}
