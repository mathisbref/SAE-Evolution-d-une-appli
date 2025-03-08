// auth.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = environment.apiUrl;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    let userData: User | null = null;
    
    // Vérifier si nous sommes dans un navigateur avant d'accéder à localStorage/sessionStorage
    if (this.isBrowser) {
      userData = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    
    this.currentUserSubject = new BehaviorSubject<User | null>(userData);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(map(response => {
        // Store user details and jwt token in local storage to keep user logged in
        const user = {
          id: response.id,
          email: email,
          token: response.token,
          role: response.role,
          prenom: response.prenom,
          nom: response.nom
        };
        
        if (this.isBrowser) {
          if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          } else {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
          }
        }
        
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // Remove user from local storage and session storage
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/utilisateurs`, user);
  }

  getUserRole(): string {
    const user = this.currentUserValue;
    return user ? user.role : '';
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    if (!this.currentUserValue) return false;
    return this.currentUserValue.role === role;
  }

  // Refresh token if needed
  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {
      token: this.currentUserValue?.token
    }).pipe(map(response => {
      const user = {...this.currentUserValue, token: response.token} as User;
      
      if (this.isBrowser) {
        if (localStorage.getItem('currentUser')) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        } else if (sessionStorage.getItem('currentUser')) {
          sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
      }
      
      this.currentUserSubject.next(user);
      return user;
    }));
  }
}