import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './infra/app.module'
import { EnvService } from './infra/env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Sinapse API')
    .setDescription('This document describes the Sinapse API')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(port)
}
bootstrap()
