import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { LoginDto, RegisterDto } from './dto/auth.dto.js'
import { JwtAuthGuard } from './guards/jwt-auth.guard.js'

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}
  @Post('register') register(@Body() dto: RegisterDto) { return this.auth.register(dto) }
  @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto) }
  @Post('logout') logout() { return { message: 'Logged out successfully.' } }
  @Get('me') @UseGuards(JwtAuthGuard) me(@Req() request: any) { return { user: request.user } }
}
