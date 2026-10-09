<?php

namespace App\Command;

use App\Entity\Pokemon;
use App\Repository\PokemonRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Importe le Pokédex depuis data/pokemons.csv.
 *
 * La commande peut être relancée sans risque : un Pokémon déjà présent
 * est mis à jour au lieu d'être créé en double.
 */
#[AsCommand(
    name: 'app:import-pokemons',
    description: 'Importe ou met à jour le Pokédex depuis data/pokemons.csv',
)]
class ImportPokemonsCommand extends Command
{
    private const CSV_PATH = __DIR__.'/../../data/pokemons.csv';

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly PokemonRepository $pokemonRepository,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $handle = fopen(self::CSV_PATH, 'r');
        if ($handle === false) {
            $io->error('Impossible d\'ouvrir '.self::CSV_PATH);

            return Command::FAILURE;
        }

        // La première ligne contient les noms des colonnes : on s'en sert comme clés.
        $headers = fgetcsv($handle, 0, ';', '"', '');
        $created = 0;
        $updated = 0;

        while (($line = fgetcsv($handle, 0, ';', '"', '')) !== false) {
            $row = array_combine($headers, $line);

            $pokemon = $this->pokemonRepository->find((int) $row['numero']);
            if ($pokemon === null) {
                $pokemon = (new Pokemon())->setId((int) $row['numero']);
                $this->em->persist($pokemon);
                ++$created;
            } else {
                ++$updated;
            }

            $pokemon
                ->setName($row['nom'])
                ->setEnglishName($row['nom_anglais'])
                ->setCategory($row['categorie'])
                ->setType1($row['type1'])
                ->setType2($row['type2'] ?: null)
                ->setHp((int) $row['pv'])
                ->setAttack((int) $row['attaque'])
                ->setDefense((int) $row['defense'])
                ->setSpecialAttack((int) $row['attaque_speciale'])
                ->setSpecialDefense((int) $row['defense_speciale'])
                ->setSpeed((int) $row['vitesse'])
                ->setGeneration((int) $row['generation'])
                ->setLegendary($row['legendaire'] === '1')
                ->setDescription($row['description']);
        }

        fclose($handle);
        $this->em->flush();

        $io->success(sprintf('%d Pokémon créés, %d mis à jour.', $created, $updated));

        return Command::SUCCESS;
    }
}
