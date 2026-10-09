<?php

namespace App\Controller;

use App\Dto\RegisterRequest;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

/**
 * La connexion (POST /api/login) est gérée directement par Symfony :
 * voir le firewall "login" dans config/packages/security.yaml.
 */
class AuthController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload] RegisterRequest $request,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em,
        JWTTokenManagerInterface $jwtManager,
    ): JsonResponse {
        if ($userRepository->findOneBy(['email' => $request->email]) !== null) {
            return $this->json(
                ['error' => 'Un compte existe déjà avec cet email.'],
                Response::HTTP_CONFLICT,
            );
        }

        $user = new User();
        $user->setEmail($request->email);
        $user->setPassword($passwordHasher->hashPassword($user, $request->password));

        $em->persist($user);
        $em->flush();

        // On renvoie directement un token : l'utilisateur est connecté dès l'inscription.
        return $this->json(
            ['token' => $jwtManager->create($user)],
            Response::HTTP_CREATED,
        );
    }
}
