import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { join } from 'node:path';
import { Express, Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Remina Survey API')
    .setDescription('API pour la plateforme d’évaluation de mots émotionnels')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const expressApp = app.getHttpAdapter().getInstance() as Express;

  if (process.env.NODE_ENV === 'production') {
    expressApp.get(/^(?!\/api).*/, (_req: Request, res: Response) => {
      res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    });
  } else {
    const proxy = createProxyMiddleware({
      target: 'http://localhost:4200',
      changeOrigin: true,
      ws: true,
    });

    expressApp.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      proxy(req, res, next).catch(next);
    });
  }

  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
}

bootstrap().catch((err) => {
  console.error("Erreur lors du démarrage de l'application:", err);
});
