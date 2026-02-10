import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css'
})
export class MobileMenuComponent {
  @Input() open = false;
  @Input() isAdmin = false;
  @Input() userName = 'Usuario';
  @Output() close = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}
