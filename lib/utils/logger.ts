type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  constructor(private context: string) {}

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      context: this.context,
      message,
      ...(data && { data })
    };

    switch (level) {
      case 'debug':
        console.debug(JSON.stringify(logData, null, 2));
        break;
      case 'info':
        console.info(JSON.stringify(logData, null, 2));
        break;
      case 'warn':
        console.warn(JSON.stringify(logData, null, 2));
        break;
      case 'error':
        console.error(JSON.stringify(logData, null, 2));
        break;
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }
}