<?php

namespace App\Repository;

use App\Entity\Pokemon;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Pokemon>
 */
class PokemonRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Pokemon::class);
    }

    /**
     * Tire un Pokémon au hasard parmi les légendaires ou parmi les autres.
     */
    public function findRandom(bool $legendary): ?Pokemon
    {
        $count = $this->count(['legendary' => $legendary]);
        if ($count === 0) {
            return null;
        }

        // On saute un nombre aléatoire de lignes puis on prend la suivante
        return $this->createQueryBuilder('p')
            ->andWhere('p.legendary = :legendary')
            ->setParameter('legendary', $legendary)
            ->orderBy('p.id')
            ->setFirstResult(random_int(0, $count - 1))
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
