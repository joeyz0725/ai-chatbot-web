// ChatDialogue.ts
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity({ name: 'chat_dialogue' })
export class ChatDialogue {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'varchar', nullable: true })
  title: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ name: 'chat_state', type: 'longtext' })
  chatState: string

  @Column({ name: 'dialogue_uuid', type: 'varchar' })
  dialogueUuid: string
}
