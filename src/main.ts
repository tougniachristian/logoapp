import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(path.join(__dirname, '..', 'storage'), {
    prefix: '/storage', // Accès via /storage/<filename>
  });

  const config = new DocumentBuilder()
    .setTitle('Logo App API')
    .setDescription('API Documentation for the Logo App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Appliquer globalement le filter d'exception
  app.useGlobalFilters(new HttpExceptionFilter());

  // Activer les pipes de validation globale
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
}
bootstrap();
