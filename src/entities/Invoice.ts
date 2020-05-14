import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Home } from './Insurance';
import { Auto } from './Auto';

@Entity('invoice')
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  payment_due_date: string;

  @Column({ default: 0 })
  payment_amount: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  payment_date: string;

  @ManyToOne((type) => Home, (home) => home.home_invoice)
  home_invoice: Invoice[];

  @ManyToOne((type) => Auto, (home) => home.auto_invoice)
  auto_invoice: Invoice[];
}
