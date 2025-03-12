<?php

namespace App\Repository;

use App\Entity\Seance;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Seance>
 */
class SeanceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Seance::class);
    }

    public function getBestThemeSeance(): array 
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            SELECT s.theme_seance, COUNT(s.id) AS nb_seances
            FROM Seance s
            GROUP BY s.theme_seance
            HAVING COUNT(s.id) = (
                SELECT MAX(nb_seances)
                FROM (
                    SELECT COUNT(*) AS nb_seances
                    FROM Seance
                    GROUP BY theme_seance
                ) AS idcoach_max_seances
            );
        ";

        $stmt = $conn->executeQuery($sql);
        return $stmt->fetchAllAssociative();
    }

    //    /**
    //     * @return Seance[] Returns an array of Seance objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Seance
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
