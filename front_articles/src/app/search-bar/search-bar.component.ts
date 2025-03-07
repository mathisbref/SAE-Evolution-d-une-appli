import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Input() width: string = '50%';
  @Input() height: string = '48px';
  @Input() placeholder: string = 'Rechercher...';
}