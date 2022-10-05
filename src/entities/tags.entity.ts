import {
  Column,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;

  @OneToOne(() => User, user => user.uid)
  @JoinColumn({ name: 'creator', referencedColumnName: 'uid' })
  creator: string;

  @ManyToMany(() => User, user => user.uid)
  @JoinTable({name: 'tags_users'})
  users: User[]
}
