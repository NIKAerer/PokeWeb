<?php

namespace App\Command;

use App\Entity\Encounter;
use App\Entity\PokemonUser;
use App\Entity\User;
use App\Repository\PokemonRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Crée (ou remet à zéro) le compte de démonstration utilisé par les recruteurs :
 * une collection déjà commencée et toutes les rencontres du jour disponibles.
 *
 * Ce mot de passe n'est pas un secret : il est affiché sur la page de connexion.
 */
#[AsCommand(
    name: 'app:demo',
    description: 'Crée ou remet à zéro le compte de démonstration',
)]
class DemoCommand extends Command
{
    public const EMAIL = 'demo@pokeweb.fr';
    public const PASSWORD = 'pokeweb-demo';
    private const USERNAME = 'Demo';

    // Numéros du Pokédex de la collection de départ, avec un surnom pour certains
    private const COLLECTION = [
        1 => null, 4 => null, 7 => null, 25 => 'Pika', 133 => null, 6 => 'Flamby',
        94 => null, 143 => 'Gros Dodo', 149 => null, 196 => null, 248 => null,
        282 => null, 445 => null, 448 => null, 658 => null, 700 => null, 384 => null,
    ];

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserRepository $userRepository,
        private readonly PokemonRepository $pokemonRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        if ($this->pokemonRepository->count() === 0) {
            $io->error('Le Pokédex est vide : lance d\'abord "php bin/console app:import-pokemons".');

            return Command::FAILURE;
        }

        $user = $this->userRepository->findOneBy(['email' => self::EMAIL]);
        if ($user === null) {
            $user = (new User())->setEmail(self::EMAIL)->setUsername(self::USERNAME);
            $this->em->persist($user);
        }
        $user->setPassword($this->passwordHasher->hashPassword($user, self::PASSWORD));
        $this->em->flush(); // le compte doit exister en base avant de supprimer ses données

        // On efface ce qu'ont fait les visiteurs précédents : rencontres puis captures
        // (dans cet ordre, car une rencontre peut pointer vers un Pokémon combattant)
        $this->em->createQuery('DELETE FROM '.Encounter::class.' e WHERE e.user = :user')
            ->setParameter('user', $user)
            ->execute();
        $this->em->createQuery('DELETE FROM '.PokemonUser::class.' c WHERE c.user = :user')
            ->setParameter('user', $user)
            ->execute();

        foreach (self::COLLECTION as $pokemonId => $nickname) {
            $capture = new PokemonUser($user, $this->pokemonRepository->find($pokemonId));
            $capture->setNickname($nickname);
            $this->em->persist($capture);
        }

        $this->em->flush();

        $io->success(sprintf('Compte de démo prêt : %s / %s (%d Pokémon).', self::EMAIL, self::PASSWORD, count(self::COLLECTION)));

        return Command::SUCCESS;
    }
}
