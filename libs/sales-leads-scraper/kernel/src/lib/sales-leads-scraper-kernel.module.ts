import { Global, Module } from '@nestjs/common';
import { SharedInfrastructureGcpLoggerModule } from '@sales-leads/shared/infrastructure-gcp-logger';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmRootModule } from './mikro-orm/mikro-orm-root.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    MikroOrmRootModule,
    SharedInfrastructureGcpLoggerModule,
  ],
  exports: [SharedInfrastructureGcpLoggerModule],
})
export class SalesLeadsScraperKernelModule {}
