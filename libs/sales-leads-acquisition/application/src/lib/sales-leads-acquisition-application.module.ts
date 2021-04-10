import { Module } from '@nestjs/common';
import { FindNewSalesLeadsHandler } from './commands/find-new-sales-leads/find-new-sales-leads.handler';
import { finders, SalesLeadsFindersToken } from './ports/sales-leads-finder';
import {CqrsModule} from "@nestjs/cqrs";

@Module({
  imports: [CqrsModule],
  providers: [
    FindNewSalesLeadsHandler,
    {
      provide: SalesLeadsFindersToken,
      useFactory: (...finders) => finders,
      inject: [...finders],
    },
  ],
  exports: [],
})
export class SalesLeadsAcquisitionApplicationModule {}
