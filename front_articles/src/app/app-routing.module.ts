import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SeanceListComponent } from './seance-list/seance-list.component';
import { LoginComponent } from './login/login.component';
import { SeanceDetailComponent } from './seance-detail/seance-detail.component';
import { CoachDetailComponent } from './coach-detail/coach-detail.component';
import { RegisterComponent } from './register/register.component';
import { PlanningComponent } from './planning/planning.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'seances', component: SeanceListComponent },
  { path: 'seance/:id', component: SeanceDetailComponent },
  { path: 'coach/:id', component: CoachDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'planning', component: PlanningComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
