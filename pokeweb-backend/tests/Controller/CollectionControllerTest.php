<?php

namespace App\Tests\Controller;

use App\Entity\Pokemon;
use App\Entity\PokemonUser;
use App\Entity\User;
use App\Tests\ApiTestCase;
use App\Tests\PokemonFactory;

/**
 * Un joueur ne peut voir et modifier que ses propres Pokémon.
 */
class CollectionControllerTest extends ApiTestCase
{
    public function testPlayerCanRenameAndReleaseHisPokemon(): void
    {
        $sacha = $this->createUser('Sacha', 'sacha@pokeweb.fr');
        $capture = $this->capture($sacha, PokemonFactory::salameche());
        $token = $this->tokenFor($sacha);

        $data = $this->requestJson('PATCH', '/api/collection/'.$capture->getId(), ['nickname' => 'Flammi'], $token);
        $this->assertStatus(200);
        $this->assertSame('Flammi', $data['nickname']);

        $this->requestJson('DELETE', '/api/collection/'.$capture->getId(), token: $token);
        $this->assertStatus(204);

        $collection = $this->requestJson('GET', '/api/collection', token: $token);
        $this->assertSame([], $collection['pokemons']);
    }

    public function testPlayerCannotTouchSomeoneElsesPokemon(): void
    {
        $sacha = $this->createUser('Sacha', 'sacha@pokeweb.fr');
        $regis = $this->createUser('Regis', 'regis@pokeweb.fr');
        $capture = $this->capture($sacha, PokemonFactory::salameche());
        $regisToken = $this->tokenFor($regis);

        // Régis essaie de modifier le Salamèche de Sacha en changeant l'id dans l'URL
        $this->requestJson('PATCH', '/api/collection/'.$capture->getId(), ['nickname' => 'Volé'], $regisToken);
        $this->assertStatus(404);

        $this->requestJson('DELETE', '/api/collection/'.$capture->getId(), token: $regisToken);
        $this->assertStatus(404);

        // Le Pokémon de Sacha n'a pas bougé
        $this->em->clear();
        $stillThere = $this->em->find(PokemonUser::class, $capture->getId());
        $this->assertNotNull($stillThere);
        $this->assertNull($stillThere->getNickname());
    }

    public function testCollectionRequiresAToken(): void
    {
        $this->requestJson('GET', '/api/collection');

        $this->assertStatus(401);
    }

    private function capture(User $user, Pokemon $pokemon): PokemonUser
    {
        $capture = new PokemonUser($user, $this->savePokemon($pokemon));
        $this->em->persist($capture);
        $this->em->flush();

        return $capture;
    }
}
