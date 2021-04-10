import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { FindNewSalesLeadsHandler } from './commands/find-new-sales-leads/find-new-sales-leads.handler';
import { finders, SalesLeadsFindersToken } from './ports/sales-leads-finder';
import { CqrsModule } from '@nestjs/cqrs';
import { SalesLeadsAcquisitionFacade } from './sales-leads-acquisition.facade';

@Module({})
export class SalesLeadsAcquisitionApplicationModule {
  static withInfrastructure(
    infrastructure: ModuleMetadata['imports']
  ): DynamicModule {
    return {
      module: SalesLeadsAcquisitionApplicationModule,
      imports: [CqrsModule, ...(infrastructure ?? [])],
      providers: [
        FindNewSalesLeadsHandler,
        SalesLeadsAcquisitionFacade,
        {
          provide: SalesLeadsFindersToken,
          useFactory: (...finders) => finders,
          inject: [...finders],
        },
      ],
      exports: [SalesLeadsAcquisitionFacade],
    };
  }
}
