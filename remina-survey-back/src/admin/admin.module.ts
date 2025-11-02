import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { Session } from '../entities/session.entity';
import { Participant } from '../entities/participant.entity';
import { Evaluation } from '../entities/evaluation.entity';
import { Word } from '../entities/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Participant, Evaluation, Word])],
  controllers: [AdminController],
})
export class AdminModule {}
