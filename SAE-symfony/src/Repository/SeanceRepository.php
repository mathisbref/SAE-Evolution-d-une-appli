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
            WHERE statut = 'validée' OR statut = 'prévue'
            GROUP BY s.theme_seance
            HAVING COUNT(s.id) = (
                SELECT MAX(nb_seances)
                FROM (
                    SELECT COUNT(*) AS nb_seances
                    FROM Seance
                    WHERE statut = 'validée' OR statut = 'prévue'
                    GROUP BY theme_seance
                ) AS idcoach_max_seances
            );
        ";

        $stmt = $conn->executeQuery($sql);
        return $stmt->fetchAllAssociative();
    }

    public function getStatsThemeSeance(): array 
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            SELECT theme_seance, COUNT(id) as nb_seances
            FROM seance
            WHERE (statut = 'validée' OR statut = 'prévue')
            GROUP BY theme_seance
            ORDER BY COUNT(id) DESC;
        ";

        $stmt = $conn->executeQuery($sql);
        return $stmt->fetchAllAssociative();
    }

    public function getStatsTypeSeance(): array 
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            SELECT type_seance, COUNT(id) as nb_seances
            FROM seance
            WHERE (statut = 'validée' OR statut = 'prévue')
            GROUP BY type_seance
            ORDER BY COUNT(id) DESC;
        ";
        $stmt = $conn->executeQuery($sql);
        return $stmt->fetchAllAssociative();
    }

    public function getTempsSeance(): array 
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            SELECT s.id, SUM(e.duree_estimee) AS temps_seance
            FROM seance s, exercice e, seance_exercice se
            WHERE (statut = 'validée' OR statut = 'prévue') AND s.id = se.seance_id AND se.exercice_id = e.id
            GROUP BY s.id
            ORDER BY temps_seance DESC
        ";
        $stmt = $conn->executeQuery($sql);
        return $stmt->fetchAllAssociative();
    }

    public function getFreqHoraires(): array 
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            SELECT 
                CONCAT(
                    LPAD(HOUR(date_heure), 2, '0'), 
                    'h-', 
                    LPAD(HOUR(date_heure) + 1, 2, '0'), 
                    'h'
                ) AS creneau_horaire,
                AVG(
                    CASE 
                        WHEN type_seance = 'solo' THEN 1 
                        WHEN type_seance = 'duo' THEN 2 
                        WHEN type_seance = 'trio' THEN 3 
                    END
                ) AS moyenne_freq
            FROM 
                seance
            WHERE 
                HOUR(date_heure) BETWEEN 8 AND 19 AND (statut = 'validée' OR statut = 'prévue')
            GROUP BY 
                HOUR(date_heure)
            ORDER BY 
                HOUR(date_heure);
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
