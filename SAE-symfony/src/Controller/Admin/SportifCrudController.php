<?php

namespace App\Controller\Admin;

use App\Entity\Sportif;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class SportifCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Sportif::class;
    }

    
    // public function configureFields(string $pageName): iterable
    // {
    //     return [
    //         IdField::new('id')->hideOnForm(),
    //         TextField::new('nom'),
    //         TextField::new('prenom'),
    //         TextField::new('email'),
    //         TextField::new('password'),
    //         TextField::new('niveau_sportif'),
    //         TextEditorField::new('date_inscription'),
    //         TextEditorField::new('description'),
    //     ];
    // }
    
}
