import { configToggleLogs } from 'src/config/config.toggleLog';

export function cl(message: any, label: string = 'LOG') {

    
  if (!configToggleLogs.loggingEnabled) {
    return;
  }
  const timestamp = new Date().toISOString();
  console.log(`[${label}] ${timestamp}`, message);
}
