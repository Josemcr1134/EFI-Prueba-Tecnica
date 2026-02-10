import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { AuthSession } from '../../core/auth/auth.models';
import { SidebarComponent } from '../../shared/layout/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { MobileMenuComponent } from '../../shared/layout/mobile-menu/mobile-menu.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, MobileMenuComponent, RouterOutlet],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  session: AuthSession | null = null;
  mobileMenuOpen = false;

  constructor(private readonly auth: AuthService, private readonly router: Router) {
    this.session = this.auth.getSession();
  }

  get userName(): string {
    return this.session?.user.fullName || 'Usuario';
  }

  get roleLabel(): string {
    return this.session?.user.role === 'admin' ? 'Administrador' : 'Usuario registrado';
  }

  get isAdmin(): boolean {
    return this.session?.user.role === 'admin';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
