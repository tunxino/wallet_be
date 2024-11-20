import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Activity {
  @Column()
  userId: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;
}
