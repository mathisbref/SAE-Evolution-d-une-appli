import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Importez le plugin timeGrid
import interactionPlugin from '@fullcalendar/interaction';
import { SeanceService } from '../services/seance.service';
import { CoachService } from '../services/coach.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Ajoutez le plugin timeGrid
    initialView: 'timeGridWeek', // Utilisez la vue timeGridWeek
    events: [],
    eventClick: this.handleEventClick.bind(this) // Nécessaire pour que `this` fonctionne dans la méthode
  };

  coachColors: { [key: string]: string } = {};

  constructor(
    private seanceService: SeanceService,
    private coachService: CoachService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.coachService.getCoachs().subscribe(coachs => {
      // Assigner des couleurs aux coachs
      coachs.forEach((coach, index) => {
        this.coachColors[coach.id] = this.getColor(index);
      });

      this.seanceService.getSeances().subscribe(data => {
        this.calendarOptions.events = data.map(seance => ({
          title: seance.theme_seance,
          start: seance.date_heure,
          id: seance.id,
          backgroundColor: seance.statut === 'annulée' ? '#d3d3d3' : this.coachColors[seance.coach_id] || '#007bff', // Couleur de fond
          borderColor: seance.statut === 'annulée' ? '#d3d3d3' : this.coachColors[seance.coach_id] || '#007bff' // Couleur de bordure
        }));
      });
    });
  }

  handleEventClick(arg: any) {
    this.router.navigate(['/seance', arg.event.id]);
  }

  getColor(index: number): string {
    const colors = ['#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1', '#fd7e14'];
    return colors[index % colors.length];
  }
}