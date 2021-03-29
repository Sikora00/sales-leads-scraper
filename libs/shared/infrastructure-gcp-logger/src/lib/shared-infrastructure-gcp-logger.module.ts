import { Module } from '@nestjs/common';
import { SharedInfrastructureGcpLoggerService } from './shared-infrastructure-gcp-logger.service';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { Logger } from '@sales-leads/shared/application';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggerConfigService } from './config/logger-config.service';
import { LoggerConfigToken } from './logger-config.interface';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
  providers: [
    { provide: Logger, useClass: SharedInfrastructureGcpLoggerService },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: LoggerConfigToken,
      useClass: LoggerConfigService,
    },
  ],
  exports: [Logger],
})
export class SharedInfrastructureGcpLoggerModule {}
