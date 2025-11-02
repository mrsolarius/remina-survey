import { Controller, Get, Header, Res, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { Participant } from '../entities/participant.entity';
import { Evaluation } from '../entities/evaluation.entity';
import { Word } from '../entities/word.entity';
import { AdminGuard } from './admin.guard';
import type { Response } from 'express';

export interface WordStats {
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

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
    @InjectRepository(Participant)
    private readonly participantsRepo: Repository<Participant>,
    @InjectRepository(Evaluation)
    private readonly evalsRepo: Repository<Evaluation>,
    @InjectRepository(Word) private readonly wordsRepo: Repository<Word>,
  ) {}

  @Get('stats')
  async stats() {
    const totalSessions = await this.sessionsRepo.count({
      where: { completed: true },
    });

    // Participants distribution (for completed sessions only)
    const rawParticipants = await this.participantsRepo
      .createQueryBuilder('p')
      .innerJoin(Session, 's', 's.participantId = p.id AND s.completed = true')
      .select('p.age_group', 'age_group')
      .addSelect('p.gender', 'gender')
      .addSelect('COUNT(*)', 'count')
      .groupBy('p.age_group')
      .addGroupBy('p.gender')
      .getRawMany<{ age_group: string; gender: string; count: string }>();

    const ageGroups: Record<string, number> = {};
    const gender: Record<string, number> = {};
    for (const row of rawParticipants) {
      ageGroups[row.age_group] =
        (ageGroups[row.age_group] || 0) + Number(row.count);
      gender[row.gender] = (gender[row.gender] || 0) + Number(row.count);
    }

    // Word stats
    const wordStats = await this.evalsRepo
      .createQueryBuilder('e')
      .innerJoin('e.word', 'w')
      .select('w.text', 'text')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(e.valence)', 'mean_valence')
      .addSelect('AVG(e.arousal)', 'mean_arousal')
      .addSelect('AVG(e.awe)', 'mean_awe')
      .addSelect('AVG(e.fear)', 'mean_fear')
      .addSelect('AVG(e.contentment)', 'mean_contentment')
      .addSelect('AVG(e.anger)', 'mean_anger')
      .addSelect('AVG(e.amusement)', 'mean_amusement')
      .addSelect('AVG(e.disgust)', 'mean_disgust')
      .addSelect('AVG(e.serenity)', 'mean_serenity')
      .addSelect('AVG(e.sadness)', 'mean_sadness')
      .addSelect('AVG(e.excitement)', 'mean_excitement')
      .addSelect('AVG(e.anxiety)', 'mean_anxiety')
      .groupBy('w.text')
      .orderBy('w.text', 'ASC')
      .getRawMany<WordStats>();

    return {
      totalSessions,
      participants: { ageGroups, gender },
      words: wordStats.map((w) => ({
        text: w.text,
        count: Number(w.count),
        mean_valence: Number(w.mean_valence),
        mean_arousal: Number(w.mean_arousal),
        mean_awe: Number(w.mean_awe),
        mean_fear: Number(w.mean_fear),
        mean_contentment: Number(w.mean_contentment),
        mean_anger: Number(w.mean_anger),
        mean_amusement: Number(w.mean_amusement),
        mean_disgust: Number(w.mean_disgust),
        mean_serenity: Number(w.mean_serenity),
        mean_sadness: Number(w.mean_sadness),
        mean_excitement: Number(w.mean_excitement),
        mean_anxiety: Number(w.mean_anxiety),
      })),
    };
  }

  @Get('export.csv')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="evaluations.csv"')
  async exportCsv(@Res() res: Response) {
    interface CsvRow {
      id: number;
      session_id: string;
      age_group: string;
      gender: string;
      word: string;
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
      is_control: boolean;
      created_at: string;
    }

    const rows = await this.evalsRepo
      .createQueryBuilder('e')
      .innerJoin('e.session', 's')
      .innerJoin('s.participant', 'p')
      .innerJoin('e.word', 'w')
      .select([
        'e.id as id',
        's.id as session_id',
        'p.age_group as age_group',
        'p.gender as gender',
        'w.text as word',
        'e.valence as valence',
        'e.arousal as arousal',
        'e.awe as awe',
        'e.fear as fear',
        'e.contentment as contentment',
        'e.anger as anger',
        'e.amusement as amusement',
        'e.disgust as disgust',
        'e.serenity as serenity',
        'e.sadness as sadness',
        'e.excitement as excitement',
        'e.anxiety as anxiety',
        'e.isControl as is_control',
        "to_char(e.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at",
      ])
      .orderBy('e.created_at', 'ASC')
      .getRawMany<CsvRow>();

    const header: (keyof CsvRow)[] = [
      'id',
      'session_id',
      'age_group',
      'gender',
      'word',
      'valence',
      'arousal',
      'awe',
      'fear',
      'contentment',
      'anger',
      'amusement',
      'disgust',
      'serenity',
      'sadness',
      'excitement',
      'anxiety',
      'is_control',
      'created_at',
    ];
    const toCsvValue = (
      v: string | number | boolean | null | undefined,
    ): string => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replaceAll('"', '""') + '"';
      }
      return s;
    };

    const lines = [header.join(',')];
    for (const r of rows) {
      lines.push(header.map((h) => toCsvValue(r[h])).join(','));
    }
    const csv = lines.join('\n');
    res.send(csv);
  }
}
