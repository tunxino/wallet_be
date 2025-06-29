import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => GroupMember, (gm) => gm.group, { cascade: true })
  members: GroupMember[];

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.groupMembers, { eager: true })
  user: User;

  @ManyToOne(() => Group, (group) => group.members, { onDelete: 'CASCADE' })
  group: Group;

  @Column()
  userId: number;
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  groupId: string;

  // @ManyToOne(() => Group, group => group.expenses)
  // group: Group;

  @Column()
  title: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'double precision' })
  amount: number;

  @Column()
  payerId: number;

  @ManyToOne(() => User, { eager: true })
  payer: User;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ExpenseShare, (share) => share.expense, { cascade: true })
  shares: ExpenseShare[];
}

@Entity()
export class ExpenseShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Expense, (expense) => expense.shares, {
    onDelete: 'CASCADE',
  })
  expense: Expense;

  @Column()
  userId: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'double precision' })
  shareAmount: number;
}
