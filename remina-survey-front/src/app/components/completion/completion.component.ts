import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-completion',
  templateUrl:'completion.component.html',
  styleUrls: ['completion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletionComponent {
  private readonly session = inject(SessionService);
  restart() {
    this.session.reset();
  }
}
