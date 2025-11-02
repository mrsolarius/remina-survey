import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from '../entities/word.entity';
import { Participant, AgeGroup, Gender } from '../entities/participant.entity';
import { Session } from '../entities/session.entity';
import { Evaluation } from '../entities/evaluation.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { SessionCompleteDto } from './dto/session-complete.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Word) private readonly wordsRepo: Repository<Word>,
    @InjectRepository(Participant)
    private readonly participantsRepo: Repository<Participant>,
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
    @InjectRepository(Evaluation)
    private readonly evalsRepo: Repository<Evaluation>,
  ) {}

  async createSession(dto: CreateSessionDto) {
    // Typage explicite des valeurs issues du DTO
    const participant = this.participantsRepo.create({
      age_group: dto.ageGroup as AgeGroup,
      gender: dto.gender as Gender,
    });

    await this.participantsRepo.save(participant);

    // Sélection des mots avec priorité aux moins évalués
    const candidates = await this.wordsRepo
      .createQueryBuilder('w')
      .orderBy('w.evaluations_count', 'ASC')
      .addOrderBy('RANDOM()')
      .limit(1000)
      .getMany();

    if (candidates.length < 29) {
      throw new BadRequestException(
        'Not enough words in the database to start a session.',
      );
    }

    const unique = candidates.slice(0, 29);
    const controlIndex = Math.floor(Math.random() * unique.length);
    const controlWord = unique[controlIndex];

    // Insertion d’un mot doublon à une position aléatoire
    const selected = [...unique];
    const insertPos = Math.floor(Math.random() * (unique.length + 1));
    selected.splice(insertPos, 0, controlWord);

    const wordsPayload = selected.map((w) => ({ id: w.id, text: w.text }));

    const session = this.sessionsRepo.create({
      participant,
      words: wordsPayload,
    });

    await this.sessionsRepo.save(session);

    return {
      sessionId: session.id,
      words: wordsPayload,
    };
  }

  async evaluate(dto: CreateEvaluationDto) {
    const session = await this.sessionsRepo.findOne({
      where: { id: dto.sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');

    const appearsInSession = session.words.some((w) => w.id === dto.wordId);
    if (!appearsInSession)
      throw new BadRequestException('Word not part of this session');

    const word = await this.wordsRepo.findOne({ where: { id: dto.wordId } });
    if (!word) throw new NotFoundException('Word not found');

    // Vérifie le nombre d’évaluations existantes pour ce mot dans la session
    const existingCount = await this.evalsRepo.count({
      where: {
        session: { id: session.id },
        word: { id: word.id },
      },
    });

    const duplicateAssigned =
      session.words.filter((w) => w.id === dto.wordId).length > 1;
    const maxAllowed = duplicateAssigned ? 2 : 1;

    if (existingCount >= maxAllowed) {
      throw new BadRequestException(
        'This word has already been fully evaluated for this session',
      );
    }

    const isControl = duplicateAssigned;

    const evaluation = this.evalsRepo.create({
      session,
      word,
      valence: dto.valence,
      arousal: dto.arousal,
      awe: dto.awe,
      fear: dto.fear,
      contentment: dto.contentment,
      anger: dto.anger,
      amusement: dto.amusement,
      disgust: dto.disgust,
      serenity: dto.serenity,
      sadness: dto.sadness,
      excitement: dto.excitement,
      anxiety: dto.anxiety,
      isControl,
    });

    await this.evalsRepo.save(evaluation);

    // Incrémente le compteur d’évaluations du mot
    await this.wordsRepo.increment({ id: word.id }, 'evaluations_count', 1);

    return { status: 'ok' };
  }

  async complete(dto: SessionCompleteDto) {
    const session = await this.sessionsRepo.findOne({
      where: { id: dto.sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.completed) return { status: 'ok' };

    session.completed = true;
    await this.sessionsRepo.save(session);
    return { status: 'ok' };
  }
}
