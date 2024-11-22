import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Activity {
  @Column()
  userId: number;

  @Column()
  walletId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column()
  amount: number;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;
}
