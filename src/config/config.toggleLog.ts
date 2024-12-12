
import * as dotenv from 'dotenv';
dotenv.config();

export const configToggleLogs = {
  loggingEnabled: process.env.LOGGING_ENABLED?.toLowerCase() === 'true',
};
