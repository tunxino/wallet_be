import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { WalletType } from './wallet.enum';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @Column({ type: 'enum', enum: WalletType })
  type: string;

  @Column()
  currency: string;

  @Column()
  accountName: string;

  @Column({ type: 'double precision' })
  amount: number;

  @Column()
  icon: string;

  @Column()
  isDefault: boolean;
}
