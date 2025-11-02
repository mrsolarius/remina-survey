import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AdminService, AdminStatsResponse } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  private readonly admin = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({ token: this.fb.nonNullable.control(this.admin.token() || '') });

  protected readonly stats = signal<AdminStatsResponse | null>(null);
  readonly entries = Object.entries;

  saveToken() {
    const token = this.form.controls.token.value.trim();
    if (token) this.admin.setToken(token);
  }

  load() {
    this.admin.getStats().subscribe({
      next: (s) => this.stats.set(s),
      error: (e) => {
        console.error(e);
        alert('Erreur de chargement. Vérifiez le token.');
      }
    });
  }

  download() {
    this.admin.downloadCsv().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'evaluations.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      },
      error: (e) => {
        console.error(e);
        alert('Export CSV échoué.');
      }
    });
  }
}
