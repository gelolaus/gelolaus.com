import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CRITICAL: Allow your Vue frontend to make requests
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Nest.js normally runs on 3000, we'll use 3001 so it doesn't conflict with Vite if run simultaneously
  await app.listen(process.env.PORT || 3001);
}
bootstrap();