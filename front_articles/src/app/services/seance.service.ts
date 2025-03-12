import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {
  private apiUrl = 'https://127.0.0.1:8008/api/seances';
  private apiUrlUserSeances = 'https://127.0.0.1:8008/api/user/seances';

  constructor(private http: HttpClient) { }

  getSeances(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.member)
    );
  }

  getUserSeances(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlUserSeances}?user=${userId}`).pipe(
      map(response => {
        console.log('API Response:', response);
        return response;
      })
    );
  }

  getSeanceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}