<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class NicknameRequest
{
    public function __construct(
        // Vide = on retire le surnom
        #[Assert\Length(max: 30, maxMessage: 'Le surnom ne peut pas dépasser {{ limit }} caractères.')]
        public readonly ?string $nickname = null,
    ) {
    }
}
