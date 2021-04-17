import { Module } from '@nestjs/common';
import { SalesLeadsAcquisitionApplicationModule } from '@sales-leads/sales-leads-acquisition/application';
import { SalesLeadsAcquisitionInfrastructureMikroOrmModule } from '@sales-leads/sales-leads-acquisition/infrastructure-mikro-orm';
import { SalesLeadsAcquisitionInfrastructureScraperStepStoneModule } from '@sales-leads/sales-leads-acquisition/infrastructure-scraper-step-stone';

@Module({
  imports: [
    SalesLeadsAcquisitionApplicationModule.withInfrastructure([
      SalesLeadsAcquisitionInfrastructureMikroOrmModule,
      SalesLeadsAcquisitionInfrastructureScraperStepStoneModule.withInfrastructure(
        [SalesLeadsAcquisitionInfrastructureMikroOrmModule]
      ),
    ]),
  ],
  exports: [SalesLeadsAcquisitionApplicationModule],
})
export class SalesLeadsAcquisitionShellModule {}
