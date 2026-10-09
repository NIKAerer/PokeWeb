<?php

namespace App\Entity;

/**
 * Les états possibles d'une rencontre avec un Pokémon sauvage.
 */
enum EncounterStatus: string
{
    case Active = 'active';   // le Pokémon est là, le joueur peut lancer une Pokéball
    case Caught = 'caught';   // capturé : il a rejoint la collection
    case Fled = 'fled';       // le Pokémon s'est enfui (plus de Pokéball, ou le joueur a fui)
    case Defeated = 'defeated'; // le Pokémon sauvage est K.O. pendant le combat
}
