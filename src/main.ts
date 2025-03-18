import 'dotenv/config';
import http from 'http';

import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { createNestHttpApp } from './app.factory';

void (async () => {
  const expressApp = express();

  const app = await createNestHttpApp(new ExpressAdapter(expressApp));
  await app.init();

  http.createServer(expressApp).listen(Number(process.env.PORT || '3000'));
})();
