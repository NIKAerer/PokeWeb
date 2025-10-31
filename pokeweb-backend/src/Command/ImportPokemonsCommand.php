<?php

namespace App\Command;

use App\Entity\Pokemon;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:import-pokemons',
    description: 'Importe les Pokémon depuis un fichier CSV',
)]
class ImportPokemonsCommand extends Command
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct();
        $this->em = $em;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $filePath = __DIR__ . '/../../public/pokemons.csv';

        if (!file_exists($filePath)) {
            $output->writeln("<error>Fichier CSV introuvable : $filePath</error>");
            return Command::FAILURE;
        }

        if (($handle = fopen($filePath, 'r')) === false) {
            $output->writeln("<error>Impossible d'ouvrir le fichier CSV.</error>");
            return Command::FAILURE;
        }

        fgetcsv($handle, 0, ';'); // Ignorer la première ligne (en-têtes)

        $count = 0;
        while (($data = fgetcsv($handle, 0, ';')) !== false) {
            if (count($data) < 13) continue;

            $pokemon = new Pokemon();
            $pokemon->setName($data[1]);
            $pokemon->setType1($data[2]);
            $pokemon->setType2($data[3] ?: null);
            $pokemon->setTotal((int)$data[4]);
            $pokemon->setHp((int)$data[5]);
            $pokemon->setAttack((int)$data[6]);
            $pokemon->setDefense((int)$data[7]);
            $pokemon->setSpAtk((int)$data[8]);
            $pokemon->setSpDef((int)$data[9]);
            $pokemon->setSpeed((int)$data[10]);
            $pokemon->setGeneration((int)$data[11]);
            $pokemon->setLegendary(strtolower(trim($data[12])) === 'true');

            $this->em->persist($pokemon);
            $count++;
        }

        fclose($handle);
        $this->em->flush();

        $output->writeln("<info>$count Pokémon importés avec succès !</info>");

        return Command::SUCCESS;
    }
}
