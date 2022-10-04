import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity('refresh_tokens')
export class AuthTokenEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'user_uid', referencedColumnName: 'uid' })
  user: Users;

  @Column({ type: 'varchar', length: 255, nullable: false })
  refresh_token: string;
}
