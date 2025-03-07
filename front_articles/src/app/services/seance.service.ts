import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {
  private apiUrl = 'https://127.0.0.1:8008/api/seances';

  constructor(private http: HttpClient) { }

  getSeances(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.member)
    );
  }

  getSeanceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}