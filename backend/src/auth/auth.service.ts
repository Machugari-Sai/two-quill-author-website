import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginDto, RegisterDto } from './dto/auth.dto.js'
import { UsersService } from '../users/users.service.js'

@Injectable()
export class AuthService {
  constructor(@Inject(UsersService) private readonly users: UsersService, @Inject(JwtService) private readonly jwt: JwtService, @Inject(ConfigService) private readonly config: ConfigService) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12)
    const user = await this.users.create(dto.name.trim(), dto.email.trim(), passwordHash)
    return this.issue(user)
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email.trim())
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Invalid email or password.')
    return this.issue(this.users.toSafeUser(user))
  }

  private async issue(user: any) {
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role })
    return { accessToken, expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'), user }
  }
}
