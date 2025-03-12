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
            SELECT c.*, U.nom AS nom, U.prenom AS prenom, CONCAT(U.nom, ' ', U.prenom) AS nompre, COUNT(s.coach_id) AS nb_seances
            FROM Coach c, Seance s, Utilisateur u
            WHERE c.id = s.coach_id AND u.id = c.id AND (s.statut = 'validée' OR s.statut = 'prévue')
            GROUP BY c.id
            HAVING COUNT(s.coach_id) = (
                SELECT MAX(nb_seances)
                FROM (
                    SELECT COUNT(coach_id) AS nb_seances
                    FROM Seance
                    WHERE (statut = 'validée' OR statut = 'prévue')
                    GROUP BY coach_id
                ) AS idcoach_max_seances
            );
        ";

        $stmt = $conn->executeQuery($sql);
        return $stmt->fetchAllAssociative();
    }

    public function getMoyenneFreqCoach(): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            SELECT c.id, u.nom, u.prenom, AVG(
            CASE WHEN type_seance = 'solo' THEN 1 WHEN type_seance = 'duo' THEN 2 WHEN type_seance = 'trio' THEN 3 END) AS moyenne_freq
            FROM coach c, seance s, utilisateur u
            WHERE c.id = s.coach_id AND u.id = c.id AND (s.statut = 'validée' OR s.statut = 'prévue')
            GROUP BY c.id;
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
