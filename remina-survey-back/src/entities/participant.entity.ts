import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type AgeGroup = '-18' | '18-25' | '26-35' | '36-45' | '46-60' | '60+';
export type Gender = 'Homme' | 'Femme' | 'Autre' | 'Préfère ne pas dire';

@Entity({ name: 'participants' })
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  age_group!: AgeGroup;

  @Column({ type: 'varchar' })
  gender!: Gender;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;
}
