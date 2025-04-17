import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  tokenFCM: string;

  @Column({ nullable: true })
  otpExpires: Date;

  @CreateDateColumn()
  createdAt: Date;
}
