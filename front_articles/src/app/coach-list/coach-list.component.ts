import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoachService } from '../services/coach.service';

@Component({
  selector: 'app-coach-list',
  templateUrl: './coach-list.component.html',
  styleUrls: ['./coach-list.component.css']
})
export class CoachListComponent implements OnInit {
  coachs: any[] = [];

  constructor(private coachService: CoachService, private router: Router) { }

  ngOnInit(): void {
    this.coachService.getCoachs().subscribe(data => {
      this.coachs = data;
    });
  }

  viewDetails(id: string): void {
    this.router.navigate(['/coach', id]);
  }
}