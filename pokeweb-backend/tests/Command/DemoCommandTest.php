<?php

namespace App\Tests\Command;

use App\Command\DemoCommand;
use App\Entity\PokemonUser;
use App\Tests\ApiTestCase;
use App\Tests\PokemonFactory;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Tester\CommandTester;

class DemoCommandTest extends ApiTestCase
{
    public function testDemoAccountIsResetEachTime(): void
    {
        // Le Pokédex de test contient tous les Pokémon de la collection de démo
        foreach ([1, 4, 6, 7, 25, 94, 133, 143, 149, 196, 248, 282, 384, 445, 448, 658, 700] as $id) {
            $this->savePokemon(PokemonFactory::create($id, 'Pokémon '.$id, 'normal'));
        }

        $command = new CommandTester((new Application(self::$kernel))->find('app:demo'));
        $command->execute([]);
        $command->assertCommandIsSuccessful();

        // Un visiteur se connecte et relâche un Pokémon
        $login = $this->requestJson('POST', '/api/login', ['email' => DemoCommand::EMAIL, 'password' => DemoCommand::PASSWORD]);
        $collection = $this->requestJson('GET', '/api/collection', token: $login['token']);
        $this->assertCount(17, $collection['pokemons']);
        $this->requestJson('DELETE', '/api/collection/'.$collection['pokemons'][0]['id'], token: $login['token']);

        // Relancer la commande remet la collection de départ
        $command->execute([]);
        $this->assertSame(17, $this->em->getRepository(PokemonUser::class)->count());
    }
}
