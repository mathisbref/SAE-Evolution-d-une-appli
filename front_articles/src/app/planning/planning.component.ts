import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SeanceService } from '../services/seance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this) // Nécessaire pour que `this` fonctionne dans la méthode
  };

  constructor(private seanceService: SeanceService, private router: Router) { }

  ngOnInit(): void {
    this.seanceService.getSeances().subscribe(data => {
      this.calendarOptions.events = data.map(seance => ({
        title: seance.theme_seance,
        start: seance.date_heure,
        id: seance.id,
        backgroundColor: '#007bff', // Couleur de fond
        borderColor: '#007bff' // Couleur de bordure
      }));
    });
  }

  handleEventClick(arg: any) {
    this.router.navigate(['/seance', arg.event.id]);
  }
}