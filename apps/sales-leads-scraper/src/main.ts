import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { Express, Request, Response } from 'express';
import * as functions from 'firebase-functions';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Logger } from '@sales-leads/shared/application';

const server: Express = express();
const createNestServer = async (expressInstance: Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );

  app.useLogger(app.get(Logger));
  if (process.env) {
    await app.init();
  } else {
    await app.listen(3000);
  }
};

export const salesLeadsScraper = async (req: Request, resp: Response) => {
  await createNestServer(server);
  functions.https.onRequest(server)(req, resp);
};
