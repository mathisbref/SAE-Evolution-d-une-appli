<?php

// src/DataFixtures/AppFixtures.php
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

        /** 
        $utilisateurs = [];
        for ($i = 0; $i < 10; $i++) {
            $utilisateur = new Utilisateur();
            $utilisateur->setEmail($faker->unique()->email);
            $utilisateur->setNom($faker->lastName);
            $utilisateur->setPrenom($faker->firstName);
            $utilisateur->setPassword($this->passwordHasher->hashPassword($utilisateur, 'password'));
            $utilisateur->setRoles(['ROLE_USER']);

            $manager->persist($utilisateur);
            $utilisateurs[] = $utilisateur;
        }
        */

        $coachs = [];
        for ($i = 0; $i < 5; $i++) {
            $coach = new Coach();
            $coach->setEmail($faker->unique()->email);
            $coach->setNom($faker->lastName);
            $coach->setPrenom($faker->firstName);
            $coach->setPassword($this->passwordHasher->hashPassword($coach, 'password'));
            $coach->setRoles(['ROLE_COACH']);
            $coach->setSpecialites([$faker->word, $faker->word]);
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

        for ($i = 0; $i < 20; $i++) {
            $seance = new Seance();
            $seance->setDateHeure($faker->dateTimeBetween('now', '+1 year'));
            $seance->setTypeSeance($faker->randomElement(['solo', 'duo', 'trio']));
            $seance->setThemeSeance($faker->word);
            $seance->setNiveauSeance($faker->randomElement(['débutant', 'intermédiaire', 'avancé']));
            $seance->setStatut($faker->randomElement(['prévue', 'validée', 'annulée']));

            $coach = $coachs[$faker->numberBetween(0, 4)];
            $seance->setCoach($coach);

            $nombreSportifs = $faker->numberBetween(1, 3);
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

        $manager->flush();
    }
}