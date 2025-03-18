import { repl } from '@nestjs/core';

import { AppModule } from './app.module';

void (async () => {
  await repl(AppModule);
})();
