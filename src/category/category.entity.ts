import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ActivityType } from "../activity_user/activity.enum";

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @Column()
  category: string;

  @Column({ type: 'enum', enum: ActivityType })
  type: string;

  @Column()
  title: string;

  @Column()
  icon: string;
}