import { Module } from '@nestjs/common';
import { SharedInfrastructureGcpLoggerModule } from '@sales-leads/shared/infrastructure-gcp-logger';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SharedInfrastructureGcpLoggerModule,
    ConfigModule.forRoot({ cache: true }),
  ],
})
export class SalesLeadsScraperKernelModule {}
