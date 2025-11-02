import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-completion',
  template: `
    <section class="container">
      <h1>Merci !</h1>
      <p>Votre session est terminée. Merci pour votre participation.</p>
      <button (click)="restart()">Recommencer</button>
    </section>
  `,
  styles: [
    `
      .container { max-width: 720px; margin: 2rem auto; padding: 0 1rem; text-align: center; }
      button { margin-top: 1.5rem; padding: .5rem 1rem; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletionComponent {
  private readonly session = inject(SessionService);
  restart() {
    this.session.reset();
  }
}
