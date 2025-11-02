import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { Word } from '../entities/word.entity';
import { Participant } from '../entities/participant.entity';
import { Session } from '../entities/session.entity';
import { Evaluation } from '../entities/evaluation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Word, Participant, Session, Evaluation])],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
