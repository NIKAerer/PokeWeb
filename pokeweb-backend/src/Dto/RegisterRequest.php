<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Données envoyées par le formulaire d'inscription.
 *
 * Symfony remplit cet objet à partir du JSON reçu (#[MapRequestPayload])
 * puis vérifie les règles ci-dessous avant d'appeler le contrôleur.
 */
final class RegisterRequest
{
    public function __construct(
        #[Assert\NotBlank(message: "L'email est obligatoire.")]
        #[Assert\Email(message: "L'adresse email n'est pas valide.")]
        public readonly string $email = '',

        #[Assert\NotBlank(message: 'Le mot de passe est obligatoire.')]
        #[Assert\Length(min: 8, minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.')]
        public readonly string $password = '',
    ) {
    }
}
