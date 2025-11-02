import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { Word } from './word.entity';

@Entity({ name: 'evaluations' })
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Session, (s) => s.evaluations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  session!: Session;

  @ManyToOne(() => Word, { eager: true, nullable: false })
  word!: Word;

  @Column({ type: 'int' })
  valence!: number; // 1-9

  @Column({ type: 'int' })
  arousal!: number; // 1-9

  @Column({ type: 'int' })
  awe!: number; // 1-5

  @Column({ type: 'int' })
  fear!: number; // 1-5

  @Column({ type: 'int' })
  contentment!: number; // 1-5

  @Column({ type: 'int' })
  anger!: number; // 1-5

  @Column({ type: 'int' })
  amusement!: number; // 1-5

  @Column({ type: 'int' })
  disgust!: number; // 1-5

  @Column({ type: 'int' })
  serenity!: number; // 1-5

  @Column({ type: 'int' })
  sadness!: number; // 1-5

  @Column({ type: 'int' })
  excitement!: number; // 1-5

  @Column({ type: 'int' })
  anxiety!: number; // 1-5

  @Column({ type: 'boolean', default: false })
  isControl!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;
}
