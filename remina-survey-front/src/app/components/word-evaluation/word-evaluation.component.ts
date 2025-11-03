import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMOTION_DEFINITIONS } from '../../shared/emotion-definitions';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Word {
  valence: number;
  arousal: number;
  awe: number;
  fear: number;
  contentment: number;
  anger: number;
  amusement: number;
  disgust: number;
  serenity: number;
  sadness: number;
  excitement: number;
  anxiety: number;
}

@Component({
  selector: 'app-word-evaluation',
  imports: [
    ReactiveFormsModule,
    NgOptimizedImage,
    MatSliderModule,
    MatButtonModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './word-evaluation.component.html',
  styleUrl: './word-evaluation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordEvaluationComponent {
  readonly definitions = EMOTION_DEFINITIONS;
  readonly word = input.required<string>();
  readonly submitting = signal(false);

  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    skip: this.fb.nonNullable.control(false),
    valence: this.fb.nonNullable.control(5, {validators: [Validators.min(1), Validators.max(9), Validators.required]}),
    arousal: this.fb.nonNullable.control(5, {validators: [Validators.min(1), Validators.max(9), Validators.required]}),
    awe: this.fb.nonNullable.control(3, {validators: [Validators.min(1), Validators.max(5), Validators.required]}),
    fear: this.fb.nonNullable.control(3, {validators: [Validators.min(1), Validators.max(5), Validators.required]}),
    contentment: this.fb.nonNullable.control(3, {validators: [Validators.min(1), Validators.max(5), Validators.required]}),
    anger: this.fb.nonNullable.control(3, {validators: [Validators.min(1), Validators.max(5), Validators.required]}),
    amusement: this.fb.nonNullable.control(3, {validators: [Validators.min(1), Validators.max(5), Validators.required]}),
    disgust: this.fb.nonNullable.control(3, {validators: [Validators.min(1), Validators.max(5), Validators.required]}),
    serenity: this.fb.nonNullable.control(3, {validators: [Validators.min(1), Validators.max(5), Validators.required]}),
    sadness: this.fb.nonNullable.control(3, {validators: [Validators.min(1), Validators.max(5), Validators.required]}),
    excitement: this.fb.nonNullable.control(3, {validators: [Validators.min(1), Validators.max(5), Validators.required]}),
    anxiety: this.fb.nonNullable.control(3, {validators: [Validators.min(1), Validators.max(5), Validators.required]}),
  });

  readonly evaluationSubmit = output<Word | null>();

  skipWord() {
    if (this.submitting()) return;
    this.form.controls.skip.setValue(true);
  }

  async onSubmit() {
    if (this.submitting()) return;
    const {skip, ...rest} = this.form.getRawValue();
    if (!skip && this.form.invalid) return;

    this.submitting.set(true);
    this.evaluationSubmit.emit(skip ? null : (rest as Word));
    this.submitting.set(false);

    this.form.reset({
      skip: false,
      valence: 5,
      arousal: 5,
      awe: 3,
      fear: 3,
      contentment: 3,
      anger: 3,
      amusement: 3,
      disgust: 3,
      serenity: 3,
      sadness: 3,
      excitement: 3,
      anxiety: 3,
    });

    // Scroll to the top of the page after each validation for better UX
    if (globalThis.window !== undefined && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
