import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Word } from '../entities/word.entity';
import { INestApplicationContext } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

async function bootstrap() {
  let app: INestApplicationContext | null = null;
  try {
    app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['log', 'error', 'warn'],
    });
    const dataSource = app.get(DataSource);
    const repo = dataSource.getRepository(Word);

    // Skip if words already exist (run only on first startup)
    const existingCount = await repo.count();
    if (existingCount > 0) {
      console.log(`Seed skipped: ${existingCount} words already present.`);
      return;
    }

    const filePath = path.resolve(__dirname, '../../data/mots.txt');
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    const unique = Array.from(new Set(lines));
    const payload = unique.map((text) => ({ text }));

    // Upsert by unique text
    await repo.upsert(payload, ['text']);
    console.log(
      `Imported ${payload.length} words (from ${lines.length} lines).`,
    );
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    if (app) await app.close();
  }
}

bootstrap();
