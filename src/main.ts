import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  initializeSwagger(app);
  await app.listen(3000);
}

function initializeSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('NestJS API Swagger doc')
    .setDescription('API Swagger documentation for Insurance Premium API')
    .setVersion('1.0.0')
    .addTag('Product')
    .addTag('Token')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

bootstrap();
