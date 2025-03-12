import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { SeanceListComponent } from './seance-list/seance-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SeanceDetailComponent } from './seance-detail/seance-detail.component';
import { CoachDetailComponent } from './coach-detail/coach-detail.component';
import { CoachListComponent } from './coach-list/coach-list.component';
import { LoginComponent } from './login/login.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './register/register.component';
import { PlanningComponent } from './planning/planning.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    CommonModule,
    RouterModule
  ],
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
    RegisterComponent,
    PlanningComponent
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),  // Ajout de withFetch()
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }