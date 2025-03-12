import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  isCoach = false;
  isSportif = false;
  userName = '';
  private authSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements d'état d'authentification
    this.authSubscription = this.authService.currentAuthUser.subscribe(user => {
      this.isLoggedIn = user.isLogged();
      this.isAdmin = user.isAdmin();
      this.isCoach = user.isCoach();
      this.isSportif = user.isSportif();
      
      if (this.isLoggedIn) {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.userName = `${currentUser.prenom || ''} ${currentUser.nom || ''}`.trim();
        } else {
          this.userName = user.email;
        }
      } else {
        this.userName = '';
      }
    });
    
    // Initialiser l'état de connexion
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.userName = `${currentUser.prenom || ''} ${currentUser.nom || ''}`.trim();
        // À vérifier selon la structure des rôles renvoyée par l'API
        this.isAdmin = currentUser.roles?.includes('ROLE_ADMIN');
        this.isCoach = currentUser.roles?.includes('ROLE_COACH');
        this.isSportif = currentUser.roles?.includes('ROLE_SPORTIF');
      }
    }
  }

  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}