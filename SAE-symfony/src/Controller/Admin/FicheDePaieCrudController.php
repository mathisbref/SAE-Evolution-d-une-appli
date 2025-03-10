<?php

namespace App\Controller\Admin;

use App\Entity\FicheDePaie;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\{TextField, TextareaField, NumberField, BooleanField, DateTimeField, AssociationField, ImageField, ChoiceField};


class FicheDePaieCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return FicheDePaie::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            // IdField::new('id'),
            AssociationField::new('coach', 'Coach')
                ->setCrudController(CoachCrudController::class) // Facultatif : permet de lier au CRUD des salariés
                ->autocomplete(),
            ChoiceField::new('periode', 'Période')
                ->setChoices([
                    'Mois' => 'mois',
                    'Semaine' => 'semaine'
                ]),
            NumberField::new('total_heures', 'Total Heures')->setNumDecimals(0),
            NumberField::new('montant_total', 'Montant Total')->setNumDecimals(0),
        ];
    }
}
