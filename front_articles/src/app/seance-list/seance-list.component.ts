import { Component, OnInit } from '@angular/core';
import { SeanceService } from '../services/seance.service';

@Component({
  selector: 'app-seance-list',
  templateUrl: './seance-list.component.html',
  styleUrls: ['./seance-list.component.css']
})
export class SeanceListComponent implements OnInit {
  seances: any[] = [];

  constructor(private seanceService: SeanceService) { }

  ngOnInit(): void {
    this.seanceService.getSeances().subscribe(data => {
      this.seances = data;
    });
  }
}