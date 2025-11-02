import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'words' })
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  text!: string;

  @Column({ type: 'int', nullable: true })
  valence_hint!: number | null;

  @Column({ type: 'int', default: 0 })
  evaluations_count!: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;
}
