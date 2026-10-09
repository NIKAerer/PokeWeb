<?php

namespace App\Tests\Controller;

use App\Tests\ApiTestCase;
use App\Tests\PokemonFactory;

/**
 * Le Pokédex est public et en lecture seule.
 */
class PokemonApiTest extends ApiTestCase
{
    public function testPokedexIsPublic(): void
    {
        $this->savePokemon(PokemonFactory::bulbizarre());

        $data = $this->requestJson('GET', '/api/pokemon/1');

        $this->assertStatus(200);
        $this->assertSame('Bulbizarre', $data['name']);
    }

    public function testNobodyCanDeleteAPokemon(): void
    {
        $this->savePokemon(PokemonFactory::bulbizarre());
        $token = $this->tokenFor($this->createUser('Sacha', 'sacha@pokeweb.fr'));

        // Même connecté, l'opération n'existe pas (405 Method Not Allowed)
        $this->requestJson('DELETE', '/api/pokemon/1', token: $token);

        $this->assertStatus(405);
    }
}
