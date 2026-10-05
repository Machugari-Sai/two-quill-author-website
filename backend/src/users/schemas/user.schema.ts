import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 80 })
  name!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 254 })
  email!: string

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash!: string

  @Column({ type: 'varchar', default: 'user', length: 20 })
  role!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
