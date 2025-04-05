import { env } from "../../config";

// Define log levels as a type
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private context: string;
  private levels: Record<LogLevel, number>;
  private currentLevel: number;

  constructor(context: string = 'App') {
    this.context = context;
    this.levels = { debug: 1, info: 2, warn: 3, error: 4 };
    this.currentLevel = this.levels.debug;

    // Set production default level
    if (env.PROD) {
      this.currentLevel = this.levels.error;
    }
  }

  setLevel(level: LogLevel): void {
    if (this.levels[level]) {
      this.currentLevel = this.levels[level];
      this.debug(`Log level set to: ${level}`);
    }
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, levelName: LogLevel, ...message: unknown[]): void {
    if (this.currentLevel <= this.levels[level]) {
      console[levelName](
        `[${this.getTimestamp()}] [${levelName.toUpperCase()}] [${this.context}]`,
        ...message
      );
    }
  }

  debug(...message: unknown[]): void {
    this.log('debug', 'debug', ...message);
  }

  info(...message: unknown[]): void {
    this.log('info', 'info', ...message);
  }

  warn(...message: unknown[]): void {
    this.log('warn', 'warn', ...message);
  }

  error(...message: unknown[]): void {
    this.log('error', 'error', ...message);
  }
}

// Create a default singleton instance
export const logger = new Logger();

// Optional: Create a function to generate contextual loggers
export function createLogger(context: string): Logger {
  return new Logger(context);
}