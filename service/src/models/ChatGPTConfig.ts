import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class ChatgptConfig {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'model', type: 'varchar', length: 255, nullable: true })
  model: string;

  @Column({ name: 'openai_address', type: 'varchar', length: 255, nullable: true })
  openaiAddress: string;

  @Column({ name: 'openai_api_key', type: 'varchar', length: 255, nullable: true })
  openaiApiKey: string;

  @Column({ name: 'reverse_proxy_address', type: 'varchar', length: 255, nullable: true })
  reverseProxyAddress: string;

  @Column({ name: 'access_token', type: 'varchar', length: 2000, nullable: true })
  accessToken: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}