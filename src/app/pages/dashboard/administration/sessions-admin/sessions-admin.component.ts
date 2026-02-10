import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { SessionsService } from '../../../../core/sessions/sessions.service';
import { SessionItem, SessionStatus } from '../../../../core/sessions/session.models';
import { getStoredSession } from '../../../../core/auth/auth.storage';
import { SearchableSelectComponent } from '../../../../shared/ui/searchable-select/searchable-select.component';

const categories = ['Formación', 'Reunión', 'Demo'];

@Component({
  selector: 'app-sessions-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchableSelectComponent],
  templateUrl: './sessions-admin.component.html',
  styleUrl: './sessions-admin.component.css'
})
export class SessionsAdminComponent {
  private readonly fb = inject(FormBuilder);
  private readonly sessionsService = inject(SessionsService);

  sessions: SessionItem[] = [];
  editingId: string | null = null;
  error = '';
  success = '';

  categoryOptions = [...categories];

  form = this.fb.group({
    imageUrl: [''],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', [Validators.required]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    dateTime: ['', [Validators.required, futureDateValidator]],
    status: ['draft' as SessionStatus, [Validators.required]]
  });

  constructor() {
    this.refresh();
    const userCity = this.currentCity;
    if (userCity) {
      this.form.patchValue({ city: userCity });
    }
  }

  get currentCity(): string {
    return getStoredSession()?.user.city || '';
  }

  get isAdmin(): boolean {
    return getStoredSession()?.user.role === 'admin';
  }

  get canDeleteInCity(): (session: SessionItem) => boolean {
    const userCity = this.currentCity.toLowerCase();
    return (session) => session.city.toLowerCase() === userCity;
  }

  onCategoryChange(category: string): void {
    this.form.patchValue({ category });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.form.patchValue({ imageUrl: String(reader.result) });
    };
    reader.readAsDataURL(file);
  }

  startEdit(session: SessionItem): void {
    this.editingId = session.id;
    this.form.reset({
      imageUrl: session.imageUrl || '',
      title: session.title,
      description: session.description,
      category: session.category,
      city: session.city,
      dateTime: session.dateTime,
      status: session.status
    });
    this.success = '';
    this.error = '';
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({
      imageUrl: '',
      title: '',
      description: '',
      category: '',
      city: this.currentCity || '',
      dateTime: '',
      status: 'draft'
    });
  }

  submit(): void {
    this.error = '';
    this.success = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    try {
      if (this.editingId) {
        this.sessionsService.updateSession(this.editingId, {
          imageUrl: payload.imageUrl || undefined,
          title: payload.title!,
          description: payload.description!,
          category: payload.category!,
          city: payload.city!,
          dateTime: payload.dateTime!,
          status: payload.status as SessionStatus
        });
        this.success = 'Sesión actualizada correctamente.';
      } else {
        this.sessionsService.createSession({
          imageUrl: payload.imageUrl || undefined,
          title: payload.title!,
          description: payload.description!,
          category: payload.category!,
          city: payload.city!,
          dateTime: payload.dateTime!,
          status: payload.status as SessionStatus
        });
        this.success = 'Sesión creada correctamente.';
      }

      this.refresh();
      this.resetForm();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'No pudimos guardar la sesión.';
    }
  }

  remove(session: SessionItem): void {
    this.error = '';
    this.success = '';
    try {
      this.sessionsService.deleteSession(session.id);
      this.refresh();
      this.success = 'Sesión eliminada.';
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'No pudimos eliminar la sesión.';
    }
  }

  private refresh(): void {
    this.sessions = this.sessionsService.getSessions();
  }
}

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const selected = new Date(value);
  if (Number.isNaN(selected.getTime())) return { invalidDate: true };
  return selected.getTime() > Date.now() ? null : { pastDate: true };
}
