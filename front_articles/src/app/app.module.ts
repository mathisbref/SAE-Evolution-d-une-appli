import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Ajout de HTTP_INTERCEPTORS
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Ajout de ReactiveFormsModule
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { SeanceListComponent } from './seance-list/seance-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SeanceDetailComponent } from './seance-detail/seance-detail.component';
import { CoachDetailComponent } from './coach-detail/coach-detail.component';
import { CoachListComponent } from './coach-list/coach-list.component';
import { LoginComponent } from './login/login.component'; // N'oubliez pas d'ajouter votre composant login

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    SeanceListComponent,
    SearchBarComponent,
    SeanceDetailComponent,
    CoachDetailComponent,
    CoachListComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }