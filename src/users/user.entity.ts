import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { GroupMember } from '../group/group.entity';

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

  @OneToMany(() => GroupMember, (gm) => gm.user)
  groupMembers: GroupMember[];
}
