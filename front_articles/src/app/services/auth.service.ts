import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export class AuthUser {
  constructor(
    public email: string = "",
    public roles: string[] = []
  ) {}

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

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentTokenSubject = new BehaviorSubject<string | null>(null);
    this.currentToken = this.currentTokenSubject.asObservable();
    this.currentAuthUserSubject = new BehaviorSubject(new AuthUser());
    this.currentAuthUser = this.currentAuthUserSubject.asObservable();

    if (this.isBrowser) {
      const storedToken: string | null = localStorage.getItem(this.localStorageToken);
      this.updateUserInfo(storedToken);
    }
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
            this.currentAuthUserSubject.next(new AuthUser(data.email, data.roles));
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

  public login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(this.apiUrlLogin, { username: email, password }).pipe(
      map(response => {
        if (response && response.token) {
          this.updateUserInfo(response.token);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  public register(userData: any): Observable<any> {
    // Définissez explicitement les en-têtes pour s'assurer que Content-Type est application/json
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    
    // Préparez les données utilisateur dans le format attendu par votre API
    const userToRegister = {
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      password: userData.password,
      roles: ['ROLE_SPORTIF'],  // Assurez-vous que c'est le format attendu par votre API
      niveau_sportif: userData.niveau_sportif
    };
    
    // Envoyez la requête avec les en-têtes appropriés
    return this.http.post(`${this.apiUrl}/utilisateurs`, userToRegister, { headers });
  }

  public logout() {
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
    return !!this.getToken();
  }

  public getCurrentUser(): any {
    if (!this.isBrowser) {
      return null;
    }
    const user = localStorage.getItem(this.localStorageUser);
    return user ? JSON.parse(user) : null;
  }
}