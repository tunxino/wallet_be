import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

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
  otp: string;  // OTP for email verification

  @Column({ nullable: true })
  otpExpires: Date;  // Expiration time for OTP

  @CreateDateColumn()
  createdAt: Date;
}
