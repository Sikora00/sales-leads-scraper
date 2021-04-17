import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SalesLeadEntity } from './entities/sales-lead.entity';
import {
  IsSalesLeadProcessedOrDuringProcessService,
  SalesLeadRepository,
  WasJobAlreadyProcessedService,
} from '@sales-leads/sales-leads-acquisition/application';
import { MikroOrmSalesLeadRepository } from './repository/mikro-orm-sales-lead.repository';
import { MikroOrmWasJobProcessedService } from './adapters/mikro-orm-was-job-processed.service';
import { MikroOrmIsSalesLeadProcessedOrDuringProcessService } from './repository/mikro-orm-is-sales-lead-processed-or-during-process.service';

@Module({
  imports: [MikroOrmModule.forFeature([SalesLeadEntity])],
  providers: [
    {
      provide: IsSalesLeadProcessedOrDuringProcessService,
      useClass: MikroOrmIsSalesLeadProcessedOrDuringProcessService,
    },
    { provide: SalesLeadRepository, useClass: MikroOrmSalesLeadRepository },
    {
      provide: WasJobAlreadyProcessedService,
      useClass: MikroOrmWasJobProcessedService,
    },
  ],
  exports: [
    IsSalesLeadProcessedOrDuringProcessService,
    SalesLeadRepository,
    WasJobAlreadyProcessedService,
  ],
})
export class SalesLeadsAcquisitionInfrastructureMikroOrmModule {}
