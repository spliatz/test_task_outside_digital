import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.uid, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator', referencedColumnName: 'uid' })
  creator: Promise<User>;

  @ManyToMany(() => User, (user) => user.uid, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'tags_users' })
  users: Promise<User[]>;
}
