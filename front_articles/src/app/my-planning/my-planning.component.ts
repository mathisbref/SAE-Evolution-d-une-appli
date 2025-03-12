import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Importez le plugin timeGrid
import interactionPlugin from '@fullcalendar/interaction';
import { SeanceService } from '../services/seance.service';
import { CoachService } from '../services/coach.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-planning',
  templateUrl: './my-planning.component.html',
  styleUrls: ['./my-planning.component.css']
})
export class MyPlanningComponent implements OnInit {
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
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentAuthUserValue;

    if (currentUser && currentUser.id) {
      this.coachService.getCoachs().subscribe(coachs => {
        // Assigner des couleurs aux coachs
        coachs.forEach((coach, index) => {
          this.coachColors[coach.id] = this.getColor(index);
        });

        this.seanceService.getSeances().subscribe(data => {
          console.log('All Seances:', data); // Ajoutez ce log pour vérifier les données
          const userSeances = data.filter(seance =>
            seance.sportifs.includes(`/api/sportifs/${currentUser.id}`)
          );
          console.log('User Seances:', userSeances); // Ajoutez ce log pour vérifier les données filtrées
          this.calendarOptions.events = userSeances.map(seance => ({
            title: seance.theme_seance,
            start: seance.date_heure,
            id: seance.id,
            backgroundColor: seance.statut === 'annulée' ? '#d3d3d3' : this.coachColors[seance.coach_id] || '#007bff', // Couleur de fond
            borderColor: seance.statut === 'annulée' ? '#d3d3d3' : this.coachColors[seance.coach_id] || '#007bff' // Couleur de bordure
          }));
        });
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  handleEventClick(arg: any) {
    this.router.navigate(['/seance', arg.event.id]);
  }

  getColor(index: number): string {
    const colors = ['#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1', '#fd7e14'];
    return colors[index % colors.length];
  }
}