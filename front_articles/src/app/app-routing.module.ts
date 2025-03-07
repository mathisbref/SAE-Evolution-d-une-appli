import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SeanceListComponent } from './seance-list/seance-list.component';
import { LoginComponent } from './login/login.component';
import { SeanceDetailComponent } from './seance-detail/seance-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'seances', component: SeanceListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'seance/:id', component: SeanceDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
