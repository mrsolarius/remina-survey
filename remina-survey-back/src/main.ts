import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
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
    .setDescription("API pour la plateforme d'évaluation de mots émotionnels")
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const expressApp = app.getHttpAdapter().getInstance() as Express;

  // En développement : proxy vers Angular
  if (process.env.NODE_ENV !== 'production') {
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
  // En production : ServeStaticModule gère déjà les fichiers statiques
  // Il suffit de laisser le module faire son travail (configuré dans app.module.ts)

  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  console.log(
    `Application running on port ${port} (${process.env.NODE_ENV || 'development'} mode)`,
  );
}

bootstrap().catch((err) => {
  console.error("Erreur lors du démarrage de l'application:", err);
});
