import http from 'http';

import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { createNestHttpApp } from './app.factory';

void (async () => {
  const expressApp = express();

  const app = await createNestHttpApp(new ExpressAdapter(expressApp));
  await app.init();

  const server = http.createServer((req, res) => {
    void expressApp(req, res);
  });

  server.listen(Number(process.env.PORT || '3000'));
})();
