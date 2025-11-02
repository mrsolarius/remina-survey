import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { of, switchMap, tap } from 'rxjs';
import { SessionService } from '../../services/session.service';
import { WordEvaluationComponent } from '../word-evaluation/word-evaluation.component';
import { EvaluationService, EvaluationPayload } from '../../services/evaluation.service';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-evaluation',
  imports: [WordEvaluationComponent, ProgressBarComponent],
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationComponent {
  private readonly session = inject(SessionService);
  private readonly evals = inject(EvaluationService);

  readonly index = this.session.currentIndex;
  readonly total = this.session.words;
  readonly word = this.session.currentWord;

  readonly percent = computed(() => {
    const idx = this.index();
    const len = this.total().length || 1;
    return Math.floor((idx / len) * 100);
  });
  readonly label = computed(() => `${this.index()} / ${this.total().length}`);

  onSubmit(wordId: string, payload: EvaluationPayload | null) {
    const nextIndex = this.index() + 1;
    const shouldComplete = nextIndex >= this.total().length;
    const complete$ = shouldComplete ? this.session.complete() : of(void 0);

    const flow$ = payload
      ? this.evals.submit(wordId, payload).pipe(switchMap(() => complete$))
      : complete$;

    flow$
      .pipe(tap(() => this.session.next()))
      .subscribe({
        error: (e) => {
          console.error(e);
          alert("Erreur lors de l'enregistrement. Merci de réessayer.");
        }
      });
  }
}
