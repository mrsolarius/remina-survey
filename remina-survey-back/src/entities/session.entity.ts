import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Participant } from './participant.entity';
import { Evaluation } from './evaluation.entity';

export interface SessionWordItem {
  id: string;
  text: string;
}

@Entity({ name: 'sessions' })
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Participant, { eager: true, nullable: false })
  participant!: Participant;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  start_time!: Date;

  @Column({ type: 'boolean', default: false })
  completed!: boolean;

  @Column({ type: 'jsonb' })
  words!: SessionWordItem[];

  @OneToMany(() => Evaluation, (e) => e.session)
  evaluations!: Evaluation[];
}
