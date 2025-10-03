import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Budget {
  @Column()
  userId: number;

  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
  id: string;

  @Column({ type: 'double precision' })
  amount: number;

  @OneToMany(() => BudgetDetail, (budgetDetail) => budgetDetail.budget, {
    cascade: true,
  })
  details: BudgetDetail[];

  @BeforeInsert()
  setDefaultDetails() {
    if (!this.details) {
      this.details = []; // Set details to an empty array if it is not provided
    }
  }
}

@Entity()
export class BudgetDetail {
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
  id: string; // A unique identifier for BudgetDetail

  @Column()
  icon: string; // The icon representing the category

  @Column({ type: 'double precision' })
  amount: number; // The amount for this budget detail

  @Column()
  name: string; // The name of the budget detail

  @ManyToOne(() => Budget, (budget) => budget.details, { nullable: false })
  budget: Budget;
}
