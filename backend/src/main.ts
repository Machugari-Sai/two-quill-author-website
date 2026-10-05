import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(helmet())
  app.setGlobalPrefix('api')
  app.enableCors({ origin: process.env.FRONTEND_URL?.split(',').map((item) => item.trim()) || ['http://127.0.0.1:5173', 'http://localhost:5173'], credentials: false })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  app.getHttpAdapter().get('/api/health', (_request: unknown, response: any) => response.json({ status: 'ok' }))
  await app.listen(Number(process.env.PORT) || 3001, '0.0.0.0')
}

bootstrap()
