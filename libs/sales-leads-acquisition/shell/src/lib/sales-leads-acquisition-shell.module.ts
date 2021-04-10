import { Module } from '@nestjs/common';
import { SalesLeadsAcquisitionApplicationModule } from '@sales-leads/sales-leads-acquisition/application';
import { SalesLeadsAcquisitionInfrastructureMikroOrmModule } from '@sales-leads/sales-leads-acquisition/infrastructure-mikro-orm';

@Module({
  imports: [
    SalesLeadsAcquisitionApplicationModule.withInfrastructure([
      SalesLeadsAcquisitionInfrastructureMikroOrmModule,
    ]),
  ],
  exports: [SalesLeadsAcquisitionApplicationModule],
})
export class SalesLeadsAcquisitionShellModule {}
