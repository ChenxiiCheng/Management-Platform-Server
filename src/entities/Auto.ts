import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Invoice } from './Invoice';

@Entity('auto')
export class Auto extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  username: string;

  @Column()
  customer_type: string;

  @Column({
    type: 'timestamp',
  })
  make_model_year: string;

  @Column({ default: 0 })
  amount: number;

  @Column()
  insurance_status: string;

  @Column({
    type: 'timestamp',
  })
  start_date: string;

  @Column({
    type: 'timestamp',
  })
  end_date: string;

  @ManyToOne((type) => User, (user) => user.auto)
  user: User;

  @OneToMany((type) => Invoice, (invoice) => invoice.auto_invoice, {
    cascade: true,
  })
  @JoinColumn()
  auto_invoice: Invoice[];
}
