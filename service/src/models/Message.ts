// Message.ts
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'
import { ChatDialogue } from './ChatDialogue'

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => ChatDialogue)
  @JoinColumn({ name: 'dialogue_id' })
  dialogue: ChatDialogue

  @Column({ type: 'varchar' })
  content: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
}
