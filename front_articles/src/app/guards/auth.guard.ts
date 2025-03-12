import { Injectable, inject } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivateFn, 
  Router, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.isLoggedIn()) {
      // Vérification des rôles si nécessaire
      const requiredRole = route.data['role'];
      if (requiredRole) {
        const user = this.authService.currentAuthUserValue;
        
        if (requiredRole === 'ROLE_ADMIN' && !user.isAdmin()) {
          this.router.navigate(['/login']);
          return false;
        }
        
        if (requiredRole === 'ROLE_COACH' && !user.isCoach()) {
          this.router.navigate(['/login']);
          return false;
        }
        
        if (requiredRole === 'ROLE_SPORTIF' && !user.isSportif()) {
          this.router.navigate(['/login']);
          return false;
        }
      }
      
      return true;
    }
    
    // Rediriger vers la page de connexion avec l'URL de retour
    return this.router.createUrlTree(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
  }
}

// Fonction à utiliser pour les routes
export const isAuthenticated: CanActivateFn = (route, state) => {
  return inject(AuthGuard).canActivate(route, state);
};

// Fonction à utiliser pour les routes accessibles uniquement aux administrateurs
export const isAdmin: CanActivateFn = (route, state) => {
  const authGuard = inject(AuthGuard);
  route.data = { ...route.data, role: 'ROLE_ADMIN' };
  return authGuard.canActivate(route, state);
};

// Fonction à utiliser pour les routes accessibles uniquement aux coachs
export const isCoach: CanActivateFn = (route, state) => {
  const authGuard = inject(AuthGuard);
  route.data = { ...route.data, role: 'ROLE_COACH' };
  return authGuard.canActivate(route, state);
};

// Fonction à utiliser pour les routes accessibles uniquement aux sportifs
export const isSportif: CanActivateFn = (route, state) => {
  const authGuard = inject(AuthGuard);
  route.data = { ...route.data, role: 'ROLE_SPORTIF' };
  return authGuard.canActivate(route, state);
};