import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FindNewSalesLeadsCommand } from './commands/find-new-sales-leads/find-new-sales-leads.command';

@Injectable()
export class SalesLeadsAcquisitionFacade {
  constructor(private commandBus: CommandBus) {}

  async findNewSalesLeads(command: FindNewSalesLeadsCommand): Promise<void> {
    await this.commandBus.execute(command);
  }
}
