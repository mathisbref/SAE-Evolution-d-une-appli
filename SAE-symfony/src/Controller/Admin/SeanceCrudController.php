<?php

namespace App\Controller\Admin;

use App\Entity\Seance;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class SeanceCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Seance::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            DateTimeField::new('date_heure')
                ->setFormat('yyyy-MM-dd HH:mm:ss'),
            ChoiceField::new('type_seance')
                ->setChoices([
                    'Solo' => 'solo',
                    'Duo' => 'duo',
                    'Trio' => 'trio',
                ]),
                ChoiceField::new('theme_seance')
                ->setChoices([
                    'Cardio' => 'cardio',
                    'Renforcement musculaire' => 'renforcement musculaire',
                    'Stretching' => 'stretching',
                    'Pilates' => 'pilates',
                    'Yoga' => 'yoga',
                    'Boxe' => 'boxe',
                    'Crossfit' => 'crossfit',
                ]),
            ChoiceField::new('niveau_seance')
                ->setChoices([
                    'Débutant' => 'débutant',
                    'Intermédiaire' => 'intermédiaire',
                    'Avancé' => 'avancé',
                ]),
            ChoiceField::new('statut')
                ->setChoices([
                    'Prévue' => 'prévue',
                    'Validée' => 'validée',
                    'Annulée' => 'annulée',
                ]),
                AssociationField::new('coach'),
                AssociationField::new('exercices')
            ->setFormTypeOptions([
                'by_reference' => false, // Important pour ManyToMany
                'multiple' => true,
            ])
            ->setRequired(false)
                
        ];
    }
    
}
