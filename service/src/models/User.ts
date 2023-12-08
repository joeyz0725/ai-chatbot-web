import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'username', unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: true, name: 'password' })
  password: string | null;
  
  @Column({ name: 'role_type', type: 'int', default: 10 })
  roleType: number;

  @Column({ type: 'varchar', nullable: true, name: 'name'  })
  name: string;

  @Column({ type: 'varchar', nullable: true, name: 'email' })
  email: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'avatar' })
  avatar: string | null;

  @Column({ type: 'text', nullable: true, name: 'description'  })
  description: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}