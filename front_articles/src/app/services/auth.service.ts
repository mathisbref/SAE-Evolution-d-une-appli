import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { catchError, map } from 'rxjs/operators';

export class AuthUser {
  constructor(
    public id: string = "",
    public email: string = "",
    public roles: string[] = []
  ) { }

  isAdmin(): boolean {
    return this.roles.includes("ROLE_ADMIN");
  }

  isCoach(): boolean {
    return this.roles.includes("ROLE_COACH");
  }

  isSportif(): boolean {
    return this.roles.includes("ROLE_SPORTIF");
  }

  isLogged(): boolean {
    return this.email.length > 0;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://127.0.0.1:8008/api';
  private apiUrlLogin = `${this.apiUrl}/login_check`;
  private apiUrlUserInfo = `${this.apiUrl}/user/me`;

  private localStorageToken = 'auth_token';
  private localStorageUser = 'current_user';

  private isBrowser: boolean;

  private currentTokenSubject: BehaviorSubject<string | null>;
  public currentToken: Observable<string | null>;
  public get currentTokenValue(): string | null { return this.currentTokenSubject.value; }

  private currentAuthUserSubject: BehaviorSubject<AuthUser>;
  public currentAuthUser: Observable<AuthUser>;
  public get currentAuthUserValue(): AuthUser { return this.currentAuthUserSubject.value; }

  // Utilisateurs de test pour l'authentification mock
  private mockUsers = [
    { id: '1', email: 'coach@example.com', password: 'coach123', roles: ['ROLE_COACH'], nom: 'Dupont', prenom: 'Jean' },
    { id: '2', email: 'sportif@example.com', password: 'sportif123', roles: ['ROLE_SPORTIF'], nom: 'Martin', prenom: 'Sophie' },
    { id: '3', email: 'admin@example.com', password: 'admin123', roles: ['ROLE_ADMIN'], nom: 'Admin', prenom: 'Super' }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.currentTokenSubject = new BehaviorSubject<string | null>(null);
    this.currentAuthUserSubject = new BehaviorSubject(new AuthUser());

    if (this.isBrowser) {
      const storedToken = localStorage.getItem(this.localStorageToken);
      this.currentTokenSubject.next(storedToken);

      const storedUser = localStorage.getItem(this.localStorageUser);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        this.currentAuthUserSubject.next(new AuthUser(userData.id, userData.email, userData.roles));
      }
    }

    this.currentToken = this.currentTokenSubject.asObservable();
    this.currentAuthUser = this.currentAuthUserSubject.asObservable();
  }

  public login(email: string, password: string): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/utilisateurs`).pipe(
      map(response => {
        const users = response.member || response;
        const user = users.find((u: any) => u.email === email);
        
        if (user) {
          this.setUserSession(user);
          return true;
        }
        
        return false;
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        
        // Fallback sur les données mock en cas d'erreur
        const mockUser = this.mockUsers.find(u => u.email === email && u.password === password);
        
        if (mockUser) {
          this.setUserSession(mockUser);
          return of(true);
        }
        
        return of(false);
      })
    );
  }

  // Méthode pour configurer la session utilisateur
  private setUserSession(user: any) {
    const mockToken = `mock_token_${Date.now()}`;

    if (this.isBrowser) {
      localStorage.setItem(this.localStorageToken, mockToken);
      localStorage.setItem(this.localStorageUser, JSON.stringify({
        id: user.id,
        email: user.email,
        roles: user.roles || ['ROLE_SPORTIF'],
        nom: user.nom,
        prenom: user.prenom
      }));
    }

    this.currentTokenSubject.next(mockToken);
    this.currentAuthUserSubject.next(new AuthUser(user.id, user.email, user.roles || ['ROLE_SPORTIF']));
  }

  private updateUserInfo(token: string | null) {
    this.currentTokenSubject.next(null);
    this.currentAuthUserSubject.next(new AuthUser());

    if (token && this.isBrowser) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'skip-token': 'true'
      });

      this.http.get<any>(this.apiUrlUserInfo, { headers }).subscribe({
        next: data => {
          if (data.email) {
            this.currentTokenSubject.next(token);
            this.currentAuthUserSubject.next(new AuthUser(data.id, data.email, data.roles));
            localStorage.setItem(this.localStorageToken, token);
            localStorage.setItem(this.localStorageUser, JSON.stringify(data));
          }
        },
        error: () => {
          // En cas d'erreur, on supprime le token
          if (this.isBrowser) {
            localStorage.removeItem(this.localStorageToken);
            localStorage.removeItem(this.localStorageUser);
          }
        }
      });
    }
  }

  public register(userData: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const userToRegister = {
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      password: userData.password,
      roles: ['ROLE_SPORTIF'], 
      niveau_sportif: userData.niveau_sportif
    };

    // Version réelle qui persiste en base de données
    return this.http.post(`${this.apiUrl}/utilisateurs`, userToRegister, { headers }).pipe(
      catchError(error => {
        console.error("Erreur d'enregistrement:", error);

        // En cas d'échec de l'API, on simule un succès avec un utilisateur mock
        const mockResponse = {
          id: Date.now(),
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          roles: ['ROLE_SPORTIF'],
          niveau_sportif: userData.niveau_sportif
        };

        this.mockUsers.push({
          id: userData.id,
          email: userData.email,
          password: userData.password,
          roles: ['ROLE_SPORTIF'],
          nom: userData.nom,
          prenom: userData.prenom
        });

        return of(mockResponse);
      })
    );
  }

  public logout() {
    // Nettoyer les données d'authentification
    this.currentTokenSubject.next(null);
    this.currentAuthUserSubject.next(new AuthUser());

    if (this.isBrowser) {
      localStorage.removeItem(this.localStorageToken);
      localStorage.removeItem(this.localStorageUser);
    }

    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.localStorageToken);
  }

  public isLoggedIn(): boolean {
    return !!this.currentTokenValue;
  }

  public getCurrentUser(): any {
    if (!this.isBrowser) {
      return null;
    }
    const user = localStorage.getItem(this.localStorageUser);
    return user ? JSON.parse(user) : null;
  }
}