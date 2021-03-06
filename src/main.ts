import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: true });

  const port = PORT || 3001;
  await app.listen(port);
  console.log(`List on port: ${port}, app start on http://localhost:${port}/`);
}
bootstrap();
