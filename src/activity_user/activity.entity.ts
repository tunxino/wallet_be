import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Activity {
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
  id: string;

  @Column()
  userId: number;

  @Column()
  walletId: string;

  @Column()
  walletType: string;

  @Column()
  type: string;

  @Column()
  note: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;
}
