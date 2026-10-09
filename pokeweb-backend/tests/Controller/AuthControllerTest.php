<?php

namespace App\Tests\Controller;

use App\Tests\ApiTestCase;

class AuthControllerTest extends ApiTestCase
{
    public function testRegisterReturnsATokenThatWorks(): void
    {
        $data = $this->requestJson('POST', '/api/register', [
            'username' => 'Sacha',
            'email' => 'sacha@pokeweb.fr',
            'password' => 'pikachu123',
        ]);

        $this->assertStatus(201);
        $this->assertArrayHasKey('token', $data);

        // Le joueur est directement connecté : le token ouvre son profil
        $profile = $this->requestJson('GET', '/api/me', token: $data['token']);
        $this->assertStatus(200);
        $this->assertSame('Sacha', $profile['username']);
    }

    public function testEmailAlreadyUsedGivesAClearMessage(): void
    {
        $this->createUser('Sacha', 'sacha@pokeweb.fr');

        $data = $this->requestJson('POST', '/api/register', [
            'username' => 'Ondine',
            'email' => 'sacha@pokeweb.fr',
            'password' => 'staross123',
        ]);

        $this->assertStatus(409);
        $this->assertSame('Un compte existe déjà avec cet email.', $data['error']);
    }

    public function testUsernameAlreadyTakenGivesAClearMessage(): void
    {
        $this->createUser('Sacha', 'sacha@pokeweb.fr');

        $data = $this->requestJson('POST', '/api/register', [
            'username' => 'Sacha',
            'email' => 'autre@pokeweb.fr',
            'password' => 'pikachu123',
        ]);

        $this->assertStatus(409);
        $this->assertSame('Ce pseudo est déjà pris.', $data['error']);
    }

    public function testShortPasswordIsRefused(): void
    {
        $data = $this->requestJson('POST', '/api/register', [
            'username' => 'Sacha',
            'email' => 'sacha@pokeweb.fr',
            'password' => 'court',
        ]);

        $this->assertStatus(422);
        $this->assertSame('password', $data['violations'][0]['propertyPath']);
    }

    public function testLoginWithGoodAndBadPassword(): void
    {
        $this->createUser('Sacha', 'sacha@pokeweb.fr', 'pikachu123');

        $data = $this->requestJson('POST', '/api/login', ['email' => 'sacha@pokeweb.fr', 'password' => 'pikachu123']);
        $this->assertStatus(200);
        $this->assertArrayHasKey('token', $data);

        $this->requestJson('POST', '/api/login', ['email' => 'sacha@pokeweb.fr', 'password' => 'mauvais']);
        $this->assertStatus(401);
    }

    public function testProfileRequiresAToken(): void
    {
        $this->requestJson('GET', '/api/me');

        $this->assertStatus(401);
    }
}
