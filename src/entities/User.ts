import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Home } from './Insurance';
import { Auto } from './Auto';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'normal' })
  role: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated: string;

  @OneToMany((type) => Home, (home) => home.user, {
    cascade: true,
  })
  @JoinColumn()
  home: Home[];

  @OneToMany((type) => Auto, (auto) => auto.user, {
    cascade: true,
  })
  @JoinColumn()
  auto: Auto[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  // 校验密码
  async comparePassword(tmpPass: string) {
    return await compare(tmpPass, this.password);
  }

  // 生成jwt token
  async getSignedJwtToken() {
    const payload = { username: this.username, role: this.role };
    return sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRE as string,
    });
  }
}
