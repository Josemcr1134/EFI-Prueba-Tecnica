import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() userName = 'Usuario';
  @Input() roleLabel = 'Usuario registrado';
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  dropdownOpen = false;

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  onToggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onLogout(): void {
    this.dropdownOpen = false;
    this.logout.emit();
  }
}
