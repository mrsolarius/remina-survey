import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from './session.service';

export interface EvaluationPayload {
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

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionService);

  submit(wordId: string, payload: EvaluationPayload) {
    const sessionId = this.session.sessionId();
    if (!sessionId) throw new Error('No active session');
    return this.http.post<{ status: 'ok' }>(`/api/evaluation`, {
      sessionId,
      wordId,
      ...payload,
    });
  }
}
