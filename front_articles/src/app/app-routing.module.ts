import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SeanceListComponent } from './seance-list/seance-list.component';
import { LoginComponent } from './login/login.component';
import { SeanceDetailComponent } from './seance-detail/seance-detail.component';
import { CoachDetailComponent } from './coach-detail/coach-detail.component';
import { RegisterComponent } from './register/register.component';
import { PlanningComponent } from './planning/planning.component';
import { isAuthenticated, isAdmin, isCoach, isSportif } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'seances', component: SeanceListComponent },
  // Routes accessibles publiquement
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Routes accessibles uniquement aux utilisateurs authentifiés
  { path: 'seance/:id', component: SeanceDetailComponent, canActivate: [isAuthenticated] },
  { path: 'coach/:id', component: CoachDetailComponent },
  
  // Planning général accessible à tous
  { path: 'planning', component: PlanningComponent },
  
  // Planning personnel uniquement accessible aux utilisateurs authentifiés
  { path: 'my-planning', component: PlanningComponent, canActivate: [isAuthenticated] },
  
  // Ajouter ici les routes protégées par rôle
  // Par exemple, une route d'administration accessible uniquement aux admins
  // { path: 'admin', component: AdminComponent, canActivate: [isAdmin] },
  
  // Redirection par défaut
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }