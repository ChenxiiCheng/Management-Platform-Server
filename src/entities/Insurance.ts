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

@Entity('home')
export class Home extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  address: string;

  @Column()
  gender: string;

  @Column()
  marital_status: string;

  @Column()
  customer_type: string;

  @Column({ default: 0 })
  premium_amount: number;

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

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  home_purchase_date: string;

  @Column({
    nullable: true,
  })
  home_purchase_value: number;

  @Column({
    nullable: true,
  })
  home_area: number;

  @Column({
    nullable: true,
  })
  type_home: string;

  @ManyToOne((type) => User, (user) => user.home)
  user: User;

  @OneToMany((type) => Invoice, (invoice) => invoice.home_invoice, {
    cascade: true,
  })
  @JoinColumn()
  home_invoice: Invoice[];
}
