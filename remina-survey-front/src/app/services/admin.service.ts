import {Injectable, inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface WordCsv {
  text: string;
  count: number;
  mean_valence: number;
  mean_arousal: number;
  mean_awe: number;
  mean_fear: number;
  mean_contentment: number;
  mean_anger: number;
  mean_amusement: number;
  mean_disgust: number;
  mean_serenity: number;
  mean_sadness: number;
  mean_excitement: number;
  mean_anxiety: number;
}

export interface AdminStatsResponse {
  totalSessions: number;
  participants: {
    ageGroups: Record<string, number>;
    gender: Record<string, number>;
  };
  words: WordCsv[];
}

@Injectable({providedIn: 'root'})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly tokenSig = signal<string | null>(localStorage.getItem('adminToken'));

  token() {
    return this.tokenSig();
  }

  setToken(token: string) {
    this.tokenSig.set(token);
    localStorage.setItem('adminToken', token);
  }

  getStats() {
    const token = this.tokenSig();
    if (!token) throw new Error('Missing admin token');
    return this.http.get<AdminStatsResponse>('/api/admin/stats', {
      headers: {Authorization: `Bearer ${token}`},
    });
  }

  downloadCsv() {
    const token = this.tokenSig();
    if (!token) throw new Error('Missing admin token');
    return this.http.get('/api/admin/export.csv', {
      headers: {Authorization: `Bearer ${token}`},
      responseType: 'blob' as const,
    });
  }
}
