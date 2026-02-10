import { Component, HostListener } from '@angular/core';
import { SessionsService } from '../../../core/sessions/sessions.service';
import { SessionItem, SessionStatus } from '../../../core/sessions/session.models';

interface CalendarCell {
  date: Date | null;
  dayLabel: string;
  key: string;
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css',
  standalone: false
})
export class SessionsComponent {
  sessions: SessionItem[] = [];
  filteredSessions: SessionItem[] = [];
  calendarCells: CalendarCell[] = [];
  weekDays: Date[] = [];
  monthLabel = '';

  categoryOptions: string[] = [];
  selectedCategory = '';

  statusFilter: SessionStatus | 'all' = 'all';

  private currentMonth = new Date();
  private currentWeekStart = this.startOfWeek(new Date());
  isMobileWeek = false;

  constructor(private readonly sessionsService: SessionsService) {
    this.loadSessions();
    this.buildCalendar();
    this.updateViewMode();
  }

  onCategoryChange(value: string): void {
    this.selectedCategory = value;
    this.applyFilters();
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.buildCalendar();
  }

  previousWeek(): void {
    this.currentWeekStart = new Date(this.currentWeekStart.getFullYear(), this.currentWeekStart.getMonth(), this.currentWeekStart.getDate() - 7);
    this.buildWeek();
  }

  nextWeek(): void {
    this.currentWeekStart = new Date(this.currentWeekStart.getFullYear(), this.currentWeekStart.getMonth(), this.currentWeekStart.getDate() + 7);
    this.buildWeek();
  }

  sessionsForDate(date: Date | null): SessionItem[] {
    if (!date) return [];
    const key = this.toDateKey(date);
    return this.filteredSessions.filter((session) => this.toDateKey(new Date(session.dateTime)) === key);
  }

  private loadSessions(): void {
    this.sessions = this.sessionsService.getSessions();
    this.categoryOptions = this.getUniqueCategories();
    this.applyFilters();
  }

  applyFilters(): void {
    const categoryQuery = this.selectedCategory.trim().toLowerCase();
    this.filteredSessions = this.sessions.filter((session) => {
      const matchCategory = categoryQuery
        ? session.category.toLowerCase().includes(categoryQuery)
        : true;
      const matchStatus = this.statusFilter === 'all' ? true : session.status === this.statusFilter;
      return matchCategory && matchStatus;
    });
  }

  private buildCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekday = (firstDay.getDay() + 6) % 7; // Monday = 0

    this.monthLabel = firstDay.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const cells: CalendarCell[] = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push({ date: null, dayLabel: '', key: `empty-${i}` });
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      const date = new Date(year, month, day);
      cells.push({
        date,
        dayLabel: String(day),
        key: this.toDateKey(date)
      });
    }

    const remainder = cells.length % 7;
    if (remainder !== 0) {
      const blanks = 7 - remainder;
      for (let i = 0; i < blanks; i += 1) {
        cells.push({ date: null, dayLabel: '', key: `empty-tail-${i}` });
      }
    }

    this.calendarCells = cells;
    this.applyFilters();
  }

  private buildWeek(): void {
    const days: Date[] = [];
    for (let i = 0; i < 7; i += 1) {
      days.push(new Date(this.currentWeekStart.getFullYear(), this.currentWeekStart.getMonth(), this.currentWeekStart.getDate() + i));
    }
    this.weekDays = days;
    this.applyFilters();
  }

  private getUniqueCategories(): string[] {
    return Array.from(new Set(this.sessions.map((session) => session.category))).sort();
  }

  private toDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private startOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = (day + 6) % 7; // Monday = 0
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff);
  }

  @HostListener('window:resize')
  updateViewMode(): void {
    this.isMobileWeek = window.innerWidth < 640;
    if (this.isMobileWeek) {
      this.buildWeek();
    } else if (this.calendarCells.length === 0) {
      this.buildCalendar();
    }
  }
}
