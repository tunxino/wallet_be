import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class FundEntity {
  @Column()
  userId: number;

  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
  id: string;

  @Column()
  title: string;

  @Column()
  note: string;

  @Column()
  currentAmount: number;

  @Column({ type: 'double precision' })
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
