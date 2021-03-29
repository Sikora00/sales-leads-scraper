import { registerAs } from '@nestjs/config';

export default registerAs('log', () => ({
  isInCloud: process.env.IS_IN_CLOUD,
  logLevel: process.env.LOG_LEVEL,
}));
