import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

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
  imports: [ReactiveFormsModule],
  templateUrl: './word-evaluation.component.html',
  styleUrl: './word-evaluation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordEvaluationComponent {
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
  }
}
