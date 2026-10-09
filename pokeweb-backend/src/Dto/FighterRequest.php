<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final class FighterRequest
{
    public function __construct(
        // Id de la capture (ligne de la collection) envoyée au combat
        #[Assert\Positive(message: 'Choisis un Pokémon de ta collection.')]
        public readonly int $captureId = 0,
    ) {
    }
}
