<?php

namespace App\Repository;

use App\Entity\Encounter;
use App\Entity\EncounterStatus;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Encounter>
 */
class EncounterRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Encounter::class);
    }

    /**
     * La rencontre en cours du joueur, s'il y en a une.
     */
    public function findActiveFor(User $user): ?Encounter
    {
        return $this->findOneBy(['user' => $user, 'status' => EncounterStatus::Active]);
    }

    /**
     * Nombre de rencontres commencées aujourd'hui par le joueur.
     */
    public function countStartedToday(User $user): int
    {
        return (int) $this->createQueryBuilder('e')
            ->select('COUNT(e.id)')
            ->andWhere('e.user = :user')
            ->andWhere('e.startedAt >= :today')
            ->setParameter('user', $user)
            ->setParameter('today', new \DateTimeImmutable('today'))
            ->getQuery()
            ->getSingleScalarResult();
    }
}
