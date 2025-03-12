<?php

namespace App\Controller\Admin;

use App\Entity\Seance;
use Doctrine\ORM\QueryBuilder;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FieldCollection;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FilterCollection;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\SearchDto;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class SeanceCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Seance::class;
    }

    public function __construct(
        private TokenStorageInterface $tokenStorage
    ) {}

    public function configureActions(Actions $actions): Actions
{
    $disableEditDelete = fn ($entity) => $entity->getStatut() === 'validée';

    return $actions
        
        ->update(Crud::PAGE_INDEX, Action::EDIT, function (Action $action) use ($disableEditDelete) {
            return $action->displayIf(fn ($entity) => !$disableEditDelete($entity));
        })
        ->update(Crud::PAGE_INDEX, Action::DELETE, function (Action $action) use ($disableEditDelete) {
            return $action->displayIf(fn ($entity) => !$disableEditDelete($entity));
        })
        ->add(Crud::PAGE_INDEX, Action::DETAIL);
}

public function createIndexQueryBuilder(SearchDto $searchDto, EntityDto $entityDto, FieldCollection $fields, FilterCollection $filters): QueryBuilder
{
    $user = $this->tokenStorage->getToken()?->getUser();

    if (!$user || !$user instanceof \App\Entity\Utilisateur) {
        throw new \Exception("Utilisateur non trouvé ou type incorrect");
    }

    $queryBuilder = parent::createIndexQueryBuilder($searchDto, $entityDto, $fields, $filters);

    // Si l'utilisateur est un admin, il voit toutes les séances
    if (in_array('ROLE_ADMIN', $user->getRoles(), true)) {
        return $queryBuilder;
    }

    // Si l'utilisateur est un coach, il ne voit que ses propres séances
    return $queryBuilder
        ->andWhere('entity.coach = :coachId')
        ->setParameter('coachId', $user->getId());
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
            ->setRequired(false),
            AssociationField::new('sportifs')
                ->setFormTypeOptions([
                    'by_reference' => false, // Important pour ManyToMany
                    'multiple' => true,
                    'attr' => [
                        'data-widget' => 'select2',
                        'data-maximum-selection-length' => 3,
                    ],
                ])
                ->setRequired(false)

                
        ];
    }
    
}
