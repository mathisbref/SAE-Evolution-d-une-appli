import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoachService } from '../services/coach.service';

@Component({
  selector: 'app-coach-detail',
  templateUrl: './coach-detail.component.html',
  styleUrls: ['./coach-detail.component.css']
})
export class CoachDetailComponent implements OnInit {
  coach: any;

  constructor(private route: ActivatedRoute, private coachService: CoachService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.coachService.getCoachById(id).subscribe(data => {
        this.coach = data;
      });
    } else {
      console.error('ID de coach non fourni');
    }
  }
}