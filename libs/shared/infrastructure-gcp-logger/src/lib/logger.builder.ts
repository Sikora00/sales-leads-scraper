import { createLogger, format, Logger, transports } from 'winston';
import { Injectable } from '@nestjs/common';
import * as Transport from 'winston-transport';
import { Format } from 'logform';
import { LoggerConfigInterface } from './logger-config.interface';

@Injectable()
export class LoggerBuilder {
  constructor(private readonly config: LoggerConfigInterface) {}

  build(): Logger {
    const level = this.config.logLevel ?? 'info';

    const logFormat = this.config.isInCloud
      ? LoggerBuilder.getSimplyLogFormat()
      : this.getPrettyLogFormat();

    const logTransports: Transport[] = [new transports.Console()];

    return createLogger({
      level,
      format: logFormat,
      transports: [...logTransports],
    });
  }

  private static getSimplyLogFormat(): Format {
    return format.combine(format.json(), format.timestamp());
  }

  private getPrettyLogFormat(): Format {
    return format.combine(
      format.timestamp(),
      format.colorize(),
      format.printf(({ timestamp, level, message, ...rest }) => {
        return `[${timestamp}] ${level}: ${message} - ${JSON.stringify(rest)}`;
      })
    );
  }
}
