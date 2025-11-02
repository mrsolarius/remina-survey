import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EMOTION_DEFINITIONS } from '../../shared/emotion-definitions';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-explications',
  imports: [RouterLink, MatExpansionModule, MatButtonModule, MatIconModule],
  templateUrl: './explications.component.html',
  styleUrl: './explications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplicationsComponent {
  readonly entries = Object.entries(EMOTION_DEFINITIONS);
}
