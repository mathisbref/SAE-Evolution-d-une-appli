import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeanceService } from '../services/seance.service';

@Component({
  selector: 'app-seance-detail',
  templateUrl: './seance-detail.component.html',
  styleUrls: ['./seance-detail.component.css']
})
export class SeanceDetailComponent implements OnInit {
  seance: any;

  constructor(private route: ActivatedRoute, private seanceService: SeanceService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.seanceService.getSeanceById(id).subscribe(data => {
        this.seance = data;
      });
    } else {
      // Gérer le cas où l'id est null
      console.error('ID de séance non fourni');
    }
  }
}