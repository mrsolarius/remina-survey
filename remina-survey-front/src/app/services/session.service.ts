import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, of, tap } from 'rxjs';

export type AgeGroup = '-18' | '18-25' | '26-35' | '36-45' | '46-60' | '60+';
export type Gender = 'Homme' | 'Femme' | 'Autre' | 'Préfère ne pas dire';

export interface SessionWord { id: string; text: string }

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly sessionIdSig = signal<string | null>(localStorage.getItem('sessionId'));
  private readonly wordsSig = signal<SessionWord[]>(JSON.parse(localStorage.getItem('words') || '[]'));
  private readonly indexSig = signal<number>(Number(localStorage.getItem('index') || '0'));

  readonly sessionId = computed(() => this.sessionIdSig());
  readonly words = computed(() => this.wordsSig());
  readonly currentIndex = computed(() => this.indexSig());
  readonly progress = computed(() => `${this.currentIndex()}/${this.words().length}`);
  readonly currentWord = computed(() => this.words()[this.currentIndex()] ?? null);

  constructor() {
    effect(() => {
      const id = this.sessionId();
      if (id) localStorage.setItem('sessionId', id);
    });
    effect(() => localStorage.setItem('words', JSON.stringify(this.words())));
    effect(() => localStorage.setItem('index', String(this.currentIndex())));
  }

  start(ageGroup: AgeGroup, gender: Gender) {
    return this.http.post<{ sessionId: string; words: SessionWord[] }>(`/api/session`, {
      ageGroup,
      gender,
    }).pipe(
      tap((res) => {
        this.sessionIdSig.set(res.sessionId);
        this.wordsSig.set(res.words);
        this.indexSig.set(0);
        void this.router.navigateByUrl('/evaluate');
      })
    );
  }

  next() {
    const idx = this.indexSig() + 1;
    this.indexSig.set(idx);
    if (idx >= this.wordsSig().length) {
      this.router.navigateByUrl('/done');
    }
  }

  complete() {
    const sessionId = this.sessionId();
    if (!sessionId) return of(void 0);
    return this.http.post<{ status: 'ok' }>(`/api/session/complete`, { sessionId }).pipe(map(() => void 0));
  }

  reset() {
    this.sessionIdSig.set(null);
    this.wordsSig.set([]);
    this.indexSig.set(0);
    localStorage.removeItem('sessionId');
    localStorage.removeItem('words');
    localStorage.removeItem('index');
  }
}
