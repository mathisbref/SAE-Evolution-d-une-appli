import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  private apiUrl = 'https://127.0.0.1:8008/api/coaches';

  constructor(private http: HttpClient) { }

  getCoachs(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.member)
    );
  }

  getCoachById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
