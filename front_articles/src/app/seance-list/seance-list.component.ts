import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeanceService } from '../services/seance.service';

@Component({
  selector: 'app-seance-list',
  templateUrl: './seance-list.component.html',
  styleUrls: ['./seance-list.component.css']
})
export class SeanceListComponent implements OnInit {
  seances: any[] = [];

  constructor(private seanceService: SeanceService, private router: Router) { }

  ngOnInit(): void {
    this.seanceService.getSeances().subscribe(data => {
      this.seances = data;
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/seance', id]);
  }
}