// entities/notification.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum RepeatType {
  NONE = 'NONE',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @CreateDateColumn({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ default: false })
  sent: boolean;

  @Column({
    type: 'enum',
    enum: RepeatType,
    default: RepeatType.NONE,
  })
  repeat: RepeatType;

  @Column({ default: false })
  processing: boolean;
}
