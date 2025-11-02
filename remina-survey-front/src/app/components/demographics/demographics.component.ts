import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService, AgeGroup, Gender } from '../../services/session.service';

@Component({
  selector: 'app-demographics',
  imports: [ReactiveFormsModule],
  templateUrl: './demographics.component.html',
  styleUrl: './demographics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemographicsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly session = inject(SessionService);

  readonly ageGroups: AgeGroup[] = ['-18', '18-25', '26-35', '36-45', '46-60', '60+'];
  readonly genders: Gender[] = ['Homme', 'Femme', 'Autre', 'Préfère ne pas dire'];

  protected readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    ageGroup: this.fb.nonNullable.control<AgeGroup | ''>('', { validators: [Validators.required] }),
    gender: this.fb.nonNullable.control<Gender | ''>('', { validators: [Validators.required] }),
  });

  onStart() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    const { ageGroup, gender } = this.form.getRawValue();
    this.session.start(ageGroup as AgeGroup, gender as Gender).subscribe({
      error: (e) => console.error(e),
      complete: () => this.loading.set(false)
    });
  }
}
