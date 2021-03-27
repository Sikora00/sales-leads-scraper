import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';

const server: Express = express();
const createNestServer = async (expressInstance: Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );
  await app.init();
};
createNestServer(server);

export const salesLeadsScraper = functions.https.onRequest(server);
