import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity('refresh_tokens')
export class AuthTokenEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_uid', referencedColumnName: 'uid' })
  user: User;

  @Column({ type: 'varchar', length: 255, nullable: false })
  refresh_token: string;
}
