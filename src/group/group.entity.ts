import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Group {
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
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
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
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
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
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
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
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
