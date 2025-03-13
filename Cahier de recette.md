# Cahier de Recette - Projet SAE S6 Suivi d'entraînements sportifs et coaching

## Introduction

Ce document présente les fonctionnalités à tester pour valider la conformité du projet par rapport au cahier des charges. Chaque fonctionnalité est décrite avec les étapes de test, les conditions de réussite et les résultats attendus.

**Note importante** : Dans le backend, un administrateur et un responsable de salle sont considérés comme le même rôle.

### Informations de connexion pour la démonstration
- **Sportif** : stephane.nguyen@renard.fr / password
- **Coach** : sylvie.levy@germain.com / password
- **Admin/Responsable** : admin@admin.fr / admin

---

## 1. Fonctionnalités Backend (Symfony) - Back-Office (/admin)

### 1.1 Gestion des utilisateurs

#### 1.1.1 Création et gestion des comptes utilisateurs

| ID | BU-01 |
|---|---|
| **Description** | Vérifier la création et gestion complète des comptes utilisateurs |
| **Prérequis** | Accès à l'interface d'administration EasyAdmin avec un compte admin |
| **Étapes de test** | 1. Créer un nouvel utilisateur (coach, sportif, admin)<br>2. Modifier ses informations<br>3. Supprimer un utilisateur existant |
| **Résultat attendu** | Les utilisateurs peuvent être créés, modifiés et supprimés correctement |
| **Statut** | ✅ Ok |

### 1.2 Gestion des séances

#### 1.2.1 Cycle de vie des séances

| ID | BS-01 |
|---|---|
| **Description** | Vérifier la gestion complète du cycle de vie d'une séance |
| **Prérequis** | Compte coach et admin |
| **Étapes de test** | 1. Créer une nouvelle séance (date, type, thème, niveau)<br>2. Modifier une séance existante<br>3. Annuler une séance<br>4. Valider une séance réalisée |
| **Résultat attendu** | Les séances peuvent être créées, modifiées, annulées et validées correctement |
| **Statut** | ✅ Ok |

### 1.3 Gestion des exercices

#### 1.3.1 Création et association d'exercices

| ID | BE-01 |
|---|---|
| **Description** | Vérifier la création et l'association d'exercices aux séances |
| **Prérequis** | Être connecté en tant que coach ou admin |
| **Étapes de test** | 1. Créer un nouvel exercice (nom, description, durée, difficulté)<br>2. Associer des exercices à une séance<br>3. Vérifier l'affichage dans le détail |
| **Résultat attendu** | Les exercices sont créés et associés correctement aux séances |
| **Statut** | ✅ Ok |

### 1.4 Statistiques et tableau de bord

| ID | BST-01 |
|---|---|
| **Description** | Vérifier l'affichage des statistiques de fréquentation |
| **Prérequis** | Compte admin avec des séances validées |
| **Étapes de test** | 1. Se connecter en tant qu'admin<br>2. Accéder au tableau de bord<br>3. Consulter les différentes statistiques |
| **Résultat attendu** | Les statistiques de fréquentation et popularité s'affichent correctement |
| **Statut** | ✅ Ok |

### 1.5 Génération des fiches de paie

| ID | BST-02 |
|---|---|
| **Description** | Vérifier la génération des fiches de paie pour les coachs |
| **Prérequis** | Compte admin et coachs avec séances validées |
| **Étapes de test** | 1. Se connecter en tant qu'admin<br>2. Accéder au module de fiches de paie<br>3. Sélectionner un coach et une période<br>4. Générer la fiche |
| **Résultat attendu** | La fiche de paie est générée avec les calculs corrects |
| **Statut** | ❌ Non Ok |

### 1.6 Fonctionnalités spécifiques du Coach

#### 1.6.1 Consultation des séances et sportifs

| ID | BC-01 |
|---|---|
| **Description** | Vérifier que le coach peut consulter ses séances et les sportifs |
| **Prérequis** | Compte coach (sylvie.levy@germain.com) |
| **Étapes de test** | 1. Se connecter en tant que coach<br>2. Consulter ses séances à venir<br>3. Consulter la liste des sportifs |
| **Résultat attendu** | Le coach peut voir ses séances et les sportifs |
| **Statut** | ✅ Ok |

#### 1.6.2 Validation des séances par le coach

| ID | BC-02 |
|---|---|
| **Description** | Vérifier la validation des séances terminées |
| **Prérequis** | Compte coach avec séances passées à l'état "prévue" |
| **Étapes de test** | 1. Se connecter en tant que coach<br>2. Sélectionner une séance passée<br>3. La valider et enregistrer les présences |
| **Résultat attendu** | Le coach peut valider ses séances terminées |
| **Statut** | ❌ Non Ok |

#### 1.6.3 Consultation de la fiche de paie par le coach

| ID | BC-03 |
|---|---|
| **Description** | Vérifier la consultation de sa fiche de paie |
| **Prérequis** | Compte coach avec séances validées |
| **Étapes de test** | 1. Se connecter en tant que coach<br>2. Accéder à la section "Ma fiche de paie" |
| **Résultat attendu** | Le coach peut consulter sa fiche de paie avec les détails |
| **Statut** | ✅ Ok |

### 1.7 Fonctionnalités spécifiques de l'Admin/Responsable

| ID | BA-01 |
|---|---|
| **Description** | Vérifier les fonctionnalités exclusives à l'admin |
| **Prérequis** | Compte admin (admin@admin.fr) |
| **Étapes de test** | 1. Gérer les coachs et sportifs<br>2. Consulter les statistiques globales<br>3. Annuler des séances<br>4. Gérer les fiches de paie |
| **Résultat attendu** | L'admin a accès à toutes les fonctions de gestion et supervision |
| **Statut** | ✅ Ok |

### 1.8 API REST

| ID | BAPI-01 |
|---|---|
| **Description** | Vérifier le fonctionnement des endpoints API |
| **Prérequis** | Des données existantes dans le système |
| **Étapes de test** | 1. Tester l'endpoint de séances<br>2. Tester l'endpoint des coachs<br>3. Tester le webservice de bilan d'entraînement<br>4. Vérifier l'authentification JWT |
| **Résultat attendu** | L'API renvoie les données correctes aux requêtes |
| **Statut** | ❌ Non Ok |

---

## 2. Fonctionnalités Frontend (Angular)

### 2.1 Interface utilisateur publique (non connecté)

#### 2.1.1 Consultation des coachs et séances

| ID | FU-01 |
|---|---|
| **Description** | Vérifier l'affichage des coachs et des séances |
| **Prérequis** | Application déployée avec des données |
| **Étapes de test** | 1. Accéder à la page d'accueil et voir la liste des coachs<br>2. Consulter le détail d'un coach<br>3. Consulter la liste des séances disponibles<br>4. Utiliser la barre de recherche |
| **Résultat attendu** | Les informations sur les coachs et séances sont correctement affichées |
| **Statut** | ✅ Ok |

#### 2.1.2 Planning et inscription

| ID | FU-02 |
|---|---|
| **Description** | Vérifier l'affichage du planning et l'inscription |
| **Prérequis** | Des séances programmées |
| **Étapes de test** | 1. Consulter le planning général<br>2. Tester le processus d'inscription en tant que sportif |
| **Résultat attendu** | Le planning s'affiche correctement et l'inscription fonctionne |
| **Statut** | ✅ Ok |

### 2.2 Interface utilisateur connecté (Sportif)

#### 2.2.1 Connexion et planning personnel

| ID | FS-01 |
|---|---|
| **Description** | Vérifier la connexion et le planning personnel |
| **Prérequis** | Compte sportif (stephane.nguyen@renard.fr) |
| **Étapes de test** | 1. Se connecter au compte sportif<br>2. Accéder à "My Planning"<br>3. Vérifier que les séances annulées sont grisées |
| **Résultat attendu** | L'accès et l'affichage du planning personnel fonctionnent |
| **Statut** | ✅ Ok |

#### 2.2.2 Gestion des réservations

| ID | FS-02 |
|---|---|
| **Description** | Vérifier la réservation et l'annulation de séances |
| **Prérequis** | Sportif connecté et séances disponibles |
| **Étapes de test** | 1. Réserver une séance disponible<br>2. Annuler une réservation existante<br>3. Consulter le détail d'une séance (exercices) |
| **Résultat attendu** | Le sportif peut gérer ses réservations et voir les détails |
| **Statut** | ❌ Non Ok |

#### 2.2.3 Déconnexion

| ID | FS-03 |
|---|---|
| **Description** | Vérifier le processus de déconnexion |
| **Prérequis** | Sportif connecté |
| **Étapes de test** | 1. Cliquer sur le bouton/lien de déconnexion<br>2. Observer la redirection |
| **Résultat attendu** | L'utilisateur est déconnecté et redirigé vers l'accueil |
| **Statut** | ✅ Ok |

---

## Récapitulatif des tests

| ID | Description | Statut |
|---|---|---|
| BU-01 | Gestion des comptes utilisateurs | ✅ Ok |
| BS-01 | Cycle de vie des séances | ✅ Ok |
| BE-01 | Création et association d'exercices | ✅ Ok |
| BST-01 | Statistiques de fréquentation | ✅ Ok |
| BST-02 | Génération des fiches de paie | ❌ Non Ok |
| BC-01 | Consultation des séances et sportifs (coach) | ✅ Ok |
| BC-02 | Validation des séances (coach) | ❌ Non Ok |
| BC-03 | Consultation de sa fiche de paie (coach) | ✅ Ok |
| BA-01 | Fonctionnalités Admin/Responsable | ✅ Ok |
| BAPI-01 | API REST | ❌ Non Ok |
| FU-01 | Consultation des coachs et séances | ✅ Ok |
| FU-02 | Planning et inscription | ✅ Ok |
| FS-01 | Connexion et planning personnel | ✅ Ok |
| FS-02 | Gestion des réservations | ❌ Non Ok |
| FS-03 | Déconnexion | ✅ Ok |
