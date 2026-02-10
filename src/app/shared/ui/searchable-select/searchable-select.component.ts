import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './searchable-select.component.html',
  styleUrl: './searchable-select.component.css'
})
export class SearchableSelectComponent {
  @Input() label = '';
  @Input() placeholder = 'Selecciona una opción';
  @Input() options: string[] = [];
  @Input() selected = '';
  @Input() allowClear = false;
  @Input() clearLabel = 'Mostrar todas';

  @Output() selectedChange = new EventEmitter<string>();

  open = false;
  search = '';

  get filteredOptions(): string[] {
    const query = this.search.trim().toLowerCase();
    if (!query) return this.options;
    return this.options.filter((option) => option.toLowerCase().includes(query));
  }

  toggle(): void {
    this.open = !this.open;
    if (this.open) {
      this.search = '';
    }
  }

  close(): void {
    this.open = false;
  }

  onSearch(value: string): void {
    this.search = value;
  }

  select(option: string): void {
    this.selectedChange.emit(option);
    this.open = false;
    this.search = '';
  }

  clear(): void {
    this.selectedChange.emit('');
    this.open = false;
    this.search = '';
  }
}
