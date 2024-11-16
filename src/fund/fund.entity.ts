import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class FundEntity {
  @Column()
  userId: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  note: string;

  @Column()
  currentAmount: number;

  @Column()
  amount: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  endDate: Date;
}
