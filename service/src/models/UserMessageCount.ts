// UserMessageCount.ts
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class UserMessageCount {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'left_count', type: 'int', default: 0 })
  leftCount: number
}
