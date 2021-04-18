import { Body, Controller, Post } from '@nestjs/common';
import {
  FindNewSalesLeadsCommand,
  SalesLeadsAcquisitionFacade,
} from '@sales-leads/sales-leads-acquisition/application';
import { FindNewSalesLeadsDto } from './dtos/find-new-sales-leads.dto';

@Controller()
export class SalesLeadsAcquisitionUiCloudFunctionController {
  constructor(
    private salesLeadsAcquisitionFacade: SalesLeadsAcquisitionFacade
  ) {}
  @Post()
  findNewSalesLeads(@Body() dto: FindNewSalesLeadsDto): Promise<void> {
    return this.salesLeadsAcquisitionFacade.findNewSalesLeads(
      new FindNewSalesLeadsCommand(dto.keyWords)
    );
  }
}
