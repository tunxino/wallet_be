import { Column, Entity, PrimaryColumn } from 'typeorm';
import { WalletType } from './wallet.enum';

@Entity()
export class Wallet {
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
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
