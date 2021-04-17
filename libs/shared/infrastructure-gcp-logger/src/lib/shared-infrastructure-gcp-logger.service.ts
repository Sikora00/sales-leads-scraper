import { Inject, Injectable } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';
import { Logger, Message } from '@sales-leads/shared/application';
import {
  LoggerConfigInterface,
  LoggerConfigToken,
} from './logger-config.interface';
import { LoggerBuilder } from './logger.builder';

type LogLevel = 'error' | 'warn' | 'notice' | 'info' | 'verbose' | 'debug';

@Injectable()
export class SharedInfrastructureGcpLoggerService implements Logger {
  logger: WinstonLogger;

  constructor(
    @Inject(LoggerConfigToken) private readonly config: LoggerConfigInterface
  ) {
    const builder = new LoggerBuilder(config);
    this.logger = builder.build();
  }
  debug(message: Message, context?: string): void {
    this.createLog('debug', message, context);
  }

  error(message: Message, trace?: string, context?: string): void {
    if (typeof message === 'object' && message?.data?.error) {
      const error: Error = message.data.error as Error;
      message.data.error = { name: error.name, message: error.message };
      message.data.stack = message.data.stack ?? error.stack;
    }
    this.createLog('error', message, context);
  }

  log(message: Message, context?: string): void {
    this.createLog('info', message, context);
  }

  verbose(message: Message, context?: string): void {
    this.createLog('verbose', message, context);
  }

  warn(message: Message, context?: string): void {
    this.createLog('warn', message, context);
  }

  private createLog(level: LogLevel, message: Message, context?: string): void {
    let data: Record<string, unknown> = {};
    let stack: unknown;

    if (typeof message === 'object') {
      ({ stack, message, data } = message);
    }

    const metadata: Record<string, unknown> = {
      context,
      stack,
      severity: level.toUpperCase(),
      ...data,
    };

    this.logger[level](message as string, metadata);
  }
}
