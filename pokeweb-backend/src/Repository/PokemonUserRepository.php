<?php

namespace App\Repository;

use App\Entity\PokemonUser;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PokemonUser>
 */
class PokemonUserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PokemonUser::class);
    }

    /**
     * @return PokemonUser[] la collection du joueur, du plus récent au plus ancien
     */
    public function findCollectionOf(User $user): array
    {
        return $this->createQueryBuilder('c')
            ->addSelect('p') // charge le Pokémon dans la même requête
            ->join('c.pokemon', 'p')
            ->andWhere('c.user = :user')
            ->setParameter('user', $user)
            ->orderBy('c.capturedAt', 'DESC')
            ->addOrderBy('c.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Nombre d'espèces différentes capturées par le joueur.
     */
    public function countDiscoveredSpecies(User $user): int
    {
        return (int) $this->createQueryBuilder('c')
            ->select('COUNT(DISTINCT IDENTITY(c.pokemon))')
            ->andWhere('c.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();
    }
}
