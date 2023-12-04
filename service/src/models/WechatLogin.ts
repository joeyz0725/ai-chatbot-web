// WechatLogin.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class WechatLogin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar' })
  openid: string;

  @Column({ type: 'varchar', nullable: true })
  unionid: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'access_token' })
  accessToken: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'refresh_token' })
  refreshToken: string | null;

  @Column({ type: 'int', nullable: true, name: 'expires_in' })
  expiresIn: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}