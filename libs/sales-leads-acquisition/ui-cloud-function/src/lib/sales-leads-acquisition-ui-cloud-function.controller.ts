import { Controller, Post } from '@nestjs/common';
import {
  FindNewSalesLeadsCommand,
  SalesLeadsAcquisitionFacade,
} from '@sales-leads/sales-leads-acquisition/application';

@Controller()
export class SalesLeadsAcquisitionUiCloudFunctionController {
  constructor(
    private salesLeadsAcquisitionFacade: SalesLeadsAcquisitionFacade
  ) {}
  @Post()
  findNewSalesLeads(): Promise<void> {
    return this.salesLeadsAcquisitionFacade.findNewSalesLeads(
      new FindNewSalesLeadsCommand()
    );
  }
}
