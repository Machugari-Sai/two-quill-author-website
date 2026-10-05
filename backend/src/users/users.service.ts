import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './schemas/user.schema.js'

export type SafeUser = { id: string; name: string; email: string; role: string; createdAt: Date; updatedAt: Date }

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async create(name: string, email: string, passwordHash: string): Promise<SafeUser> {
    try {
      const user = this.users.create({ name, email: email.toLowerCase(), passwordHash, role: 'user' })
      await this.users.save(user)
      return this.toSafeUser(user)
    } catch (error: any) {
      if (error?.code === 'SQLITE_CONSTRAINT' || error?.errno === 19 || String(error?.message).includes('UNIQUE constraint failed')) {
        throw new ConflictException('An account with this email already exists.')
      }
      throw error
    }
  }

  findByEmail(email: string) { return this.users.createQueryBuilder('user').addSelect('user.passwordHash').where('user.email = :email', { email: email.toLowerCase() }).getOne() }

  findById(id: string) { return this.users.findOneBy({ id }) }

  toSafeUser(user: User): SafeUser {
    return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt }
  }
}
