import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { FindNewSalesLeadsCommand } from './find-new-sales-leads.command';
import {
  ISalesLeadsFinder,
  SalesLeadsFindersToken,
} from '../../ports/sales-leads-finder';
import { Inject } from '@nestjs/common';
import { SalesLeadRepository } from '../../ports/sales-lead.repository';
import {
  SalesLead,
  SalesLeadData,
} from '@sales-leads/sales-leads-acquisition/domain';
import { NewSalesLeadsAcquiredEvent } from '@sales-leads/shared/application';

@CommandHandler(FindNewSalesLeadsCommand)
export class FindNewSalesLeadsHandler
  implements ICommandHandler<FindNewSalesLeadsCommand> {
  constructor(
    @Inject(SalesLeadsFindersToken) private finders: ISalesLeadsFinder[],
    private eventBus: EventBus,
    private publisher: EventPublisher,
    private repository: SalesLeadRepository
  ) {}

  async execute(command: FindNewSalesLeadsCommand): Promise<void> {
    const found = await Promise.allSettled(
      this.finders.map((finder) => finder.find())
    );
    const results = found
      .filter(
        (result): result is PromiseFulfilledResult<SalesLeadData[]> =>
          result.status === 'fulfilled'
      )
      .map((result: PromiseFulfilledResult<SalesLeadData[]>) => result.value);
    const flatResults = results.flat();

    await Promise.allSettled(
      flatResults.map((result) => {
        const salesLead = this.publisher.mergeObjectContext(
          SalesLead.acquired(result)
        );
        this.repository.save(salesLead);
        salesLead.commit();
      })
    );

    this.eventBus.publish(new NewSalesLeadsAcquiredEvent(flatResults.length));
  }
}
