<?php

namespace App\Repository;

use App\Entity\Coach;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Coach>
 */
class CoachRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Coach::class);
    }

    public function getCoachLePlusProductif(): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            SELECT c.*, u.*
            FROM Coach c, Seance s, Utilisateur u
            WHERE c.id = s.coach_id AND u.id = c.id
            GROUP BY c.id
            HAVING COUNT(s.coach_id) = (
                SELECT MAX(nb_seances)
                FROM (
                    SELECT COUNT(coach_id) AS nb_seances
                    FROM Seance
                    GROUP BY coach_id
                ) AS idcoach_max_seances
            );
        ";

        $stmt = $conn->executeQuery($sql);
        return $stmt->fetchAllAssociative();
    }

    //    /**
    //     * @return Coach[] Returns an array of Coach objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Coach
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
