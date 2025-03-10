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

    public function getTop3Seances(): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            SELECT s.date_heure, s.theme_seance, COUNT(ss.sportif_id) as nb_participants, CONCAT(U.nom, ' ', U.prenom) AS Coach
            FROM Seance s, Seance_sportif ss, Coach c, Utilisateur u
            WHERE s.id = ss.seance_id AND s.coach_id = c.id AND c.id = u.id
            GROUP BY s.id
            ORDER BY nb_participants DESC
            LIMIT 3
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
