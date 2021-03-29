import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { Express } from 'express';
import * as functions from 'firebase-functions';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Logger } from '@sales-leads/shared/application';

const server: Express = express();
const createNestServer = async (expressInstance: Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    { logger: false }
  );

  app.useLogger(app.get(Logger));
  await app.listen(3000);
};
createNestServer(server);

export const salesLeadsScraper = functions.https.onRequest(server);
