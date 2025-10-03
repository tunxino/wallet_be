import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ActivityType } from '../activity_user/activity.enum';

@Entity()
export class Category {
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
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
