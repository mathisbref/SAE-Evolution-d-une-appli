import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeanceService } from '../services/seance.service';
import { ExerciceService } from '../services/exercice.service';

@Component({
  selector: 'app-seance-detail',
  templateUrl: './seance-detail.component.html',
  styleUrls: ['./seance-detail.component.css']
})
export class SeanceDetailComponent implements OnInit {
  seance: any;
  exercices: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private seanceService: SeanceService,
    private exerciceService: ExerciceService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.seanceService.getSeanceById(id).subscribe(data => {
        this.seance = data;
        this.loadExercices(data.exercices);
      });
    } else {
      console.error('ID de séance non fourni');
    }
  }

  loadExercices(exerciceUrls: string[]): void {
    exerciceUrls.forEach(url => {
      const id = url.split('/').pop(); // Extraire l'ID de l'URL
      if (id) {
        this.exerciceService.getExerciceById(id).subscribe(exercice => {
          this.exercices.push(exercice);
        });
      }
    });
  }
}