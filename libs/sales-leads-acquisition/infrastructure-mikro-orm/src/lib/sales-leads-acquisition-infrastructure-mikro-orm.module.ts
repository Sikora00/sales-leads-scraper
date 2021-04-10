import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SalesLeadEntity } from './entities/sales-lead.entity';
import { SalesLeadRepository } from '@sales-leads/sales-leads-acquisition/application';
import { MikroOrmSalesLeadRepository } from './repository/mikro-orm-sales-lead.repository';

@Module({
  imports: [MikroOrmModule.forFeature([SalesLeadEntity])],
  providers: [
    { provide: SalesLeadRepository, useClass: MikroOrmSalesLeadRepository },
  ],
  exports: [SalesLeadRepository],
})
export class SalesLeadsAcquisitionInfrastructureMikroOrmModule {}
