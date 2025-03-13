<?php

namespace App\DataFixtures;

use App\Entity\Utilisateur;
use App\Entity\Coach;
use App\Entity\Sportif;
use App\Entity\Seance;
use App\Entity\Exercice;
use App\Entity\FicheDePaie;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $coachs = [];
        for ($i = 0; $i < 5; $i++) {
            $coach = new Coach();
            $coach->setEmail($faker->unique()->email);
            $coach->setNom($faker->lastName);
            $coach->setPrenom($faker->firstName);
            $coach->setPassword($this->passwordHasher->hashPassword($coach, 'password'));
            $coach->setRoles(['ROLE_COACH']);
            $coach->setSpecialites($faker->randomElements(['cardio','renforcement musculaire','stretching','pilates','yoga','boxe','crossfit'], $faker->numberBetween(2, 4)));
            $coach->setTarifHoraire($faker->randomFloat(2, 20, 100));

            $manager->persist($coach);
            $coachs[] = $coach;
        }

        $sportifs = [];
        for ($i = 0; $i < 10; $i++) {
            $sportif = new Sportif();
            $sportif->setEmail($faker->unique()->email);
            $sportif->setNom($faker->lastName);
            $sportif->setPrenom($faker->firstName);
            $sportif->setPassword($this->passwordHasher->hashPassword($sportif, 'password'));
            $sportif->setRoles(['ROLE_SPORTIF']);
            $sportif->setDateInscription($faker->dateTimeThisYear);
            $sportif->setNiveauSportif($faker->randomElement(['débutant', 'intermédiaire', 'avancé']));

            $manager->persist($sportif);
            $sportifs[] = $sportif;
        }

        $exercices = [];
        for ($i = 0; $i < 15; $i++) {
            $exercice = new Exercice();
            $exercice->setNom($faker->word);
            $exercice->setDescription($faker->sentence);
            $exercice->setDureeEstimee($faker->numberBetween(10, 60));
            $exercice->setDifficulte($faker->randomElement(['facile', 'moyen', 'difficile']));

            $manager->persist($exercice);
            $exercices[] = $exercice;
        }

        for ($i = 0; $i < 200; $i++) {
            $seance = new Seance();
            $seance->setDateHeure($faker->dateTimeBetween('now', '+1 month'));

            $nombreSportifs = $faker->numberBetween(0, 3);
            if ($nombreSportifs === 0) {
                $typeSeance = $faker->randomElement(['solo', 'duo', 'trio']);
            } elseif ($nombreSportifs === 1) {
                $typeSeance = 'solo';
            } elseif ($nombreSportifs === 2) {
                $typeSeance = 'duo';
            } elseif ($nombreSportifs === 3) {
                $typeSeance = 'trio';
            } else {
                $typeSeance = 'trio';
            }

            $seance->setTypeSeance($typeSeance);
            $seance->setThemeSeance($faker->randomElement(['cardio','renforcement musculaire','stretching','pilates','yoga','boxe','crossfit']));
            $seance->setNiveauSeance($faker->randomElement(['débutant', 'intermédiaire', 'avancé']));
            $seance->setStatut($faker->randomElement(['prévue', 'validée', 'annulée']));

            $coach = $coachs[$faker->numberBetween(0, 4)];
            $seance->setCoach($coach);

            for ($j = 0; $j < $nombreSportifs; $j++) {
                $sportif = $sportifs[$faker->numberBetween(0, 9)];
                $seance->addSportif($sportif);
            }

            $nombreExercices = $faker->numberBetween(1, 5);
            for ($k = 0; $k < $nombreExercices; $k++) {
                $exercice = $exercices[$faker->numberBetween(0, 14)];
                $seance->addExercice($exercice);
            }

            $manager->persist($seance);
        }

        for ($i = 0; $i < 10; $i++) {
            $fiche = new FicheDePaie();
            $fiche->setPeriode($faker->randomElement(['mois', 'semaine']));
            $fiche->setTotalHeures($faker->numberBetween(10, 40));
            $fiche->setMontantTotal($faker->randomFloat(2, 200, 2000));

            $coach = $coachs[$faker->numberBetween(0, 4)];
            $fiche->setCoach($coach);

            $manager->persist($fiche);
        }

        $admin = new Utilisateur();
        $admin->setEmail('admin@admin.fr');
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin'));
        $admin->setRoles(["ROLE_USER","ROLE_ADMIN"]);

        $manager->persist($admin);

        $coach = new Coach();
        $coach->setEmail("coach@coach.fr");
        $coach->setNom("Test");
        $coach->setPrenom("Coach");
        $coach->setPassword($this->passwordHasher->hashPassword($coach, 'coach'));
        $coach->setRoles(['ROLE_COACH']);
        $coach->setSpecialites($faker->randomElements(['cardio','renforcement musculaire','stretching','pilates','yoga','boxe','crossfit'], $faker->numberBetween(2, 4)));
        $coach->setTarifHoraire($faker->randomFloat(2, 20, 100));

        $manager->persist($coach);

        $sportif = new Sportif();
        $sportif->setEmail('sportif@sportif.fr');
        $sportif->setNom('Test');
        $sportif->setPrenom('Sportif');
        $sportif->setPassword($this->passwordHasher->hashPassword($sportif, 'sportif'));
        $sportif->setRoles(['ROLE_SPORTIF']);
        $sportif->setDateInscription($faker->dateTimeThisYear);
        $sportif->setNiveauSportif($faker->randomElement(['débutant', 'intermédiaire', 'avancé']));

        $manager->persist($sportif);

        $manager->flush();
    }
}