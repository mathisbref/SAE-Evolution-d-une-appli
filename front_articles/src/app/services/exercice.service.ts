import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {
  private apiUrl = 'https://127.0.0.1:8008/api/exercices';

  constructor(private http: HttpClient) { }


  getExercices(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.member)
    );
  }

  getExerciceById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
