import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from './@constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: true });
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('AWS Grep API')
    .setDescription('AWS S3 GREP servise api specification')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = PORT || 3001;
  await app.listen(port);
  console.log(`List on port: ${port}, app start on http://localhost:${port}/`);
}
bootstrap();
