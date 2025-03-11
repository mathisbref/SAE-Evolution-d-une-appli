<?php

namespace App\Controller\Admin;

use App\Entity\Coach;
use App\Entity\Exercice;
use App\Entity\FicheDePaie;
use App\Entity\Seance;
use App\Entity\Sportif;
use App\Entity\Utilisateur;
use App\Repository\SeanceRepository;
use App\Repository\SportifRepository;
use App\Repository\CoachRepository;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[AdminDashboard(routePath: '/admin', routeName: 'admin')]
class DashboardController extends AbstractDashboardController
{
    private $seanceRepository;
    private $sportifRepository;
    private $coachRepository;

    public function __construct(SeanceRepository $seanceRepository, SportifRepository $sportifRepository, CoachRepository $coachRepository)
    {
        $this->seanceRepository = $seanceRepository;
        $this->sportifRepository = $sportifRepository;
        $this->coachRepository = $coachRepository;
    }

    #[Route('/admin', name: 'admin')]
    public function index(): Response
    {
        // Récupérer toutes les séances
        $seances = $this->seanceRepository->findAll();

        // Tableau pour stocker les taux d'occupation de chaque séance
        $tauxSeances = [];

        foreach ($seances as $seance) {
            // Déterminer la capacité maximale en fonction du type de séance
            $capaciteMax = match ($seance->getTypeSeance()) {
                'solo' => 1,
                'duo' => 2,
                'trio' => 3,
                default => 0,
            };

            // Récupérer le nombre d'inscrits pour la séance
            $nombreInscrits = $seance->getSportifs()->count();

            // Calculer le taux d'occupation pour cette séance
            $taux = ($capaciteMax > 0) ? ($nombreInscrits / $capaciteMax) * 100 : 0;

            // Stocker le taux d'occupation dans le tableau
            $tauxSeances[] = $taux;
        }

        // Calculer la moyenne des taux d'occupation
        $tauxOccupationMoyen = (count($tauxSeances) > 0) ? array_sum($tauxSeances) / count($tauxSeances) : 0;

        // Arrondir le taux d'occupation moyen à 2 décimales
        $tauxOccupation = round($tauxOccupationMoyen, 2);

        
        // Récupérer tous les sportifs
        $sportifs = $this->sportifRepository->findAll();

        // Calculer le taux d'absentéisme pour chaque sportif
        //$tauxAbsenteisme = [];
        $tauxTot = 0;
        foreach ($sportifs as $sportif) {
            $seancesInscrites = $sportif->getSeances()->count();
            $seancesAnnulees = $sportif->getSeances()->filter(function ($seance) {
                return $seance->getStatut() === 'annulée';
            })->count();

            $taux = ($seancesInscrites > 0) ? ($seancesAnnulees / $seancesInscrites) * 100 : 0;
            //$tauxAbsenteisme[$sportif->getId()] = round($taux, 2);
            $tauxTot = $tauxTot + round($taux, 2);
        }

        $tauxAbsenteisme = $tauxTot / count($sportifs);
        $coachLePlusProductif = $this->coachRepository->getCoachLePlusProductif();

        // Classer les séances par popularité (nombre de sportifs inscrits)
        //$seancesPopulaires = $this->seanceRepository->getTop3Seances();

        // Passer les données à la vue
        return $this->render('admin/dashboard.html.twig', [
            'tauxOccupation' => $tauxOccupation,
            // 'tauxSeances' => $tauxSeances,
            'tauxAbsenteisme' => $tauxAbsenteisme,
            'coachProductifs' => $coachLePlusProductif,
            // 'seancesPopulaires' => $seancesPopulaires,
        ]);
    }


    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('SAE Symfony');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        // yield MenuItem::linkToCrud('The Label', 'fas fa-list', EntityClass::class);
        if (in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
        yield MenuItem::linkToCrud('Utilisateurs', 'fa fa-folder', Utilisateur::class);
        }
        yield MenuItem::linkToCrud ('Coachs', 'fa fa-folder', Coach::class);
        yield MenuItem::linkToCrud ('Sportifs', 'fa fa-folder', Sportif::class);
        
        if (in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
            yield MenuItem::linkToCrud('FicheDePaie', 'fa fa-folder', FicheDePaie::class);
        }        
        yield MenuItem::linkToCrud ('Seance', 'fa fa-folder', Seance::class);
        yield MenuItem::linkToCrud ('Exercice', 'fa fa-folder', Exercice::class);
    }
}
