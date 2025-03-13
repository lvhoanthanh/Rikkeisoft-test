// Supporting create migration files
import { configService } from '../config/config.service';
import fs = require('fs');
fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(
    {
      ...configService.getTypeOrmConfig(),
      seeds: ['src/seeds/*{.ts,.js}'],
      factories: ['src/factories/*{.ts,.js}'],
    },
    null,
    2,
  ),
);
