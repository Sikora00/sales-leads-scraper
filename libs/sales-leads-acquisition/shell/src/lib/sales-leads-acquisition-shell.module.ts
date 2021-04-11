import { Module } from '@nestjs/common';
import { SalesLeadsAcquisitionApplicationModule } from '@sales-leads/sales-leads-acquisition/application';
import { SalesLeadsAcquisitionInfrastructureMikroOrmModule } from '@sales-leads/sales-leads-acquisition/infrastructure-mikro-orm';
import { SalesLeadsAcquisitionInfrastructureCrawlerStepStoneModule } from '@sales-leads/sales-leads-acquisition/infrastructure-crawler-step-stone';

@Module({
  imports: [
    SalesLeadsAcquisitionApplicationModule.withInfrastructure([
      SalesLeadsAcquisitionInfrastructureMikroOrmModule,
      SalesLeadsAcquisitionInfrastructureCrawlerStepStoneModule,
    ]),
  ],
  exports: [SalesLeadsAcquisitionApplicationModule],
})
export class SalesLeadsAcquisitionShellModule {}
