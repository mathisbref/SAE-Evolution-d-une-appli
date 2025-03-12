import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeanceService } from '../services/seance.service';

@Component({
  selector: 'app-seance-list',
  templateUrl: './seance-list.component.html',
  styleUrls: ['./seance-list.component.css']
})
export class SeanceListComponent implements OnInit {
  seances: any[] = [];
  filteredSeances: any[] = [];
  searchTerm: string = '';

  constructor(private seanceService: SeanceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.getSeances();
    });
  }

  getSeances(): void {
    this.seanceService.getSeances().subscribe(data => {
      this.seances = Array.isArray(data) ? data : [];
      this.filterSeances();
    });
  }

  filterSeances(): void {
    if (this.searchTerm) {
      this.filteredSeances = this.seances.filter(seance =>
        seance.theme_seance.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredSeances = this.seances;
    }
  }

  onSearch(term: string): void {
    this.router.navigate(['/seances'], { queryParams: { search: term } });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/seance', id]);
  }
}