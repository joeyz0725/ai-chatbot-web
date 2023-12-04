// UserMessageCount.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class UserMessageCount {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'role_type', type: 'int', default: 0 })
  roleType: number;

  @Column({ name: 'left_count', type: 'int', default: 0 })
  leftCount: number;
}