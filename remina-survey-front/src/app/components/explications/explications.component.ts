import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {EMOTION_DEFINITIONS} from '../../shared/emotion-definitions';

@Component({
  selector: 'app-explications',
  imports: [RouterLink],
  templateUrl: './explications.component.html',
  styleUrl: './explications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplicationsComponent {
  readonly entries= Object.entries(EMOTION_DEFINITIONS);
}
