import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule } from '@nestjs/throttler'
import { ThrottlerGuard } from '@nestjs/throttler'
import { AuthModule } from './auth/auth.module.js'
import { UsersModule } from './users/users.module.js'
import { User } from './users/schemas/user.schema.js'

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true }), ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]), TypeOrmModule.forRoot({ type: 'sqlite', database: process.env.SQLITE_PATH || 'two-quill.sqlite', entities: [User], synchronize: true }), UsersModule, AuthModule], providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }] })
export class AppModule {}
