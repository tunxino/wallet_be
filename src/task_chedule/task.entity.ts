// entities/notification.entity.ts
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
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
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
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
