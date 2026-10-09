<?php

namespace App\Tests;

use App\Entity\Pokemon;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Base des tests fonctionnels : chaque test démarre avec une base de données
 * de test vide (var/test.db) et appelle l'API comme le ferait le front.
 */
abstract class ApiTestCase extends WebTestCase
{
    protected KernelBrowser $client;
    protected EntityManagerInterface $em;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->em = static::getContainer()->get(EntityManagerInterface::class);

        // On recrée toutes les tables à partir des entités
        $schemaTool = new SchemaTool($this->em);
        $metadata = $this->em->getMetadataFactory()->getAllMetadata();
        $schemaTool->dropSchema($metadata);
        $schemaTool->createSchema($metadata);
    }

    /**
     * Envoie une requête JSON, avec le token du joueur s'il est donné,
     * et renvoie la réponse décodée.
     *
     * @param array<string, mixed>|null $body
     *
     * @return array<string, mixed>|null
     */
    protected function requestJson(string $method, string $uri, ?array $body = null, ?string $token = null): ?array
    {
        $headers = ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'];
        if ($token !== null) {
            $headers['HTTP_AUTHORIZATION'] = 'Bearer '.$token;
        }

        $this->client->request($method, $uri, server: $headers, content: $body === null ? null : json_encode($body));

        return json_decode((string) $this->client->getResponse()->getContent(), true);
    }

    protected function createUser(string $username, string $email, string $password = 'motdepasse'): User
    {
        $user = new User();
        $user->setUsername($username)->setEmail($email);
        $hasher = static::getContainer()->get(UserPasswordHasherInterface::class);
        $user->setPassword($hasher->hashPassword($user, $password));

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }

    /**
     * Un token JWT valide pour ce joueur, sans passer par /api/login.
     */
    protected function tokenFor(User $user): string
    {
        return static::getContainer()->get(JWTTokenManagerInterface::class)->create($user);
    }

    protected function savePokemon(Pokemon $pokemon): Pokemon
    {
        $this->em->persist($pokemon);
        $this->em->flush();

        return $pokemon;
    }

    protected function assertStatus(int $expected): void
    {
        $this->assertSame($expected, $this->client->getResponse()->getStatusCode());
    }
}
