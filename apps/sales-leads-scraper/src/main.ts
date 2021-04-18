import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { Express, Request, Response } from 'express';
import * as functions from 'firebase-functions';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Logger } from '@sales-leads/shared/application';
import { ValidationPipe } from '@nestjs/common';

const server: Express = express();
const isInCloud = process.env.IS_IN_CLOUD === 'true';
const createNestServer = async (expressInstance: Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );

  app.useGlobalPipes(new ValidationPipe());

  app.useLogger(app.get(Logger));
  if (isInCloud) {
    await app.init();
  } else {
    await app.listen(3000);
  }
};

if (!isInCloud) {
  createNestServer(server);
}

export const salesLeadsScraper = async (req: Request, resp: Response) => {
  await createNestServer(server);
  functions.https.onRequest(server)(req, resp);
};
