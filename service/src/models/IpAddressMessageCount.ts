import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class IpAddressMessageCount {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'ip_address', type: 'varchar' })
  ipAddress: string

  @Column({ name: 'session_id', type: 'varchar' })
  sessionId: string

  @Column({ name: 'left_count', type: 'int', default: 0 })
  leftCount: number
}
