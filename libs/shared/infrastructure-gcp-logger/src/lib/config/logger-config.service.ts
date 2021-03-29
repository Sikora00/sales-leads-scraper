import { Injectable, LogLevel } from '@nestjs/common';
import { LoggerConfigInterface } from '../logger-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerConfigService implements LoggerConfigInterface {
  constructor(private configService: ConfigService) {}
  get isInCloud(): boolean {
    return this.configService.get('log.isInCloud') === 'true';
  }

  get logLevel(): LogLevel | undefined {
    return this.configService.get<LogLevel>('log.logLevel');
  }
}
