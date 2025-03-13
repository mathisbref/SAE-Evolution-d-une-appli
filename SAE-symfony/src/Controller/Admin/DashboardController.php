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
        $sportifs = $this->sportifRepository->findAll();
        $seances = $this->seanceRepository->findAll();

        $tauxSeances = [];

        // CALCUL DU TAUX D'OCCUPATION MOYEN DES SEANCES
        foreach ($seances as $seance) {
            $capaciteMax = match ($seance->getTypeSeance()) {
                'solo' => 1,
                'duo' => 2,
                'trio' => 3,
                default => 0,
            };

            $nombreInscrits = $seance->getSportifs()->count();

            $taux = ($capaciteMax > 0) ? ($nombreInscrits / $capaciteMax) * 100 : 0;

            $tauxSeances[] = $taux;
        }
        $tauxOccupationMoyen = (count($tauxSeances) > 0) ? array_sum($tauxSeances) / count($tauxSeances) : 0;
        $tauxOccupation = round($tauxOccupationMoyen, 2);

        

        // CALCUL DU TAUX D'ABSENTEISME
        $tauxTot = 0;
        foreach ($sportifs as $sportif) {
            $seancesInscrites = $sportif->getSeances()->count();
            $seancesAnnulees = $sportif->getSeances()->filter(function ($seance) {
                return $seance->getStatut() === 'annulée';
            })->count();

            $taux = ($seancesInscrites > 0) ? ($seancesAnnulees / $seancesInscrites) * 100 : 0;
            $tauxTot = $tauxTot + round($taux, 2);
        }

        $tauxAbsenteisme = $tauxTot / count($sportifs);

        // CALCUL DU TEMPS MOYEN D'UNE SEANCE
        $tempsSeances = $this->seanceRepository->getTempsSeance();
        $tauxTot = 0;
        foreach ($tempsSeances as $seance) {
            $tauxTot = $tauxTot + $seance['temps_seance'];
        }
        $tempsMoyenSeance = $tauxTot / count($tempsSeances);
        $tempsMoyenSeance = round($tempsMoyenSeance, 0);

        // RECUPERATION DES AUTRES INFOS
        $coachLePlusProductif = $this->coachRepository->getCoachLePlusProductif();
        $bestThemeSeance = $this->seanceRepository->getBestThemeSeance();
        $statsThemeSeance = $this->seanceRepository->getStatsThemeSeance();
        $statsTypeSeance = $this->seanceRepository->getStatsTypeSeance();
        $tauxFreqCoachs = $this->coachRepository->getMoyenneFreqCoach();
        $tauxFreqHoraires = $this->seanceRepository->getFreqHoraires();


        return $this->render('admin/dashboard.html.twig', [
            'tauxOccupation' => $tauxOccupation,
            'tauxAbsenteisme' => $tauxAbsenteisme,
            'coachsProd' => $coachLePlusProductif,
            'bestThemeSeance' => $bestThemeSeance,
            'statsThemeSeance' => $statsThemeSeance,
            'statsTypeSeance' => $statsTypeSeance,
            'tempsMoyenSeance' => $tempsMoyenSeance,
            'tauxFreqCoachs' => $tauxFreqCoachs,
            'tauxFreqHoraires' => $tauxFreqHoraires,
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
