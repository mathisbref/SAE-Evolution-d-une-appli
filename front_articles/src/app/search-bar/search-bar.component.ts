import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Input() width: string = '50%';
  @Input() height: string = '48px';
  @Input() placeholder: string = 'Rechercher...';
  searchTerm: string = '';

  @Output() search = new EventEmitter<string>();

  onSearch(): void {
    this.search.emit(this.searchTerm);
  }
}