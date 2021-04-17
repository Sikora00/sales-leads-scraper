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
import { SalesLead } from '@sales-leads/sales-leads-acquisition/domain';
import {
  Logger,
  NewSalesLeadsAcquiredEvent,
} from '@sales-leads/shared/application';
import { from } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

@CommandHandler(FindNewSalesLeadsCommand)
export class FindNewSalesLeadsHandler
  implements ICommandHandler<FindNewSalesLeadsCommand> {
  constructor(
    @Inject(SalesLeadsFindersToken) private finders: ISalesLeadsFinder[],
    private eventBus: EventBus,
    private logger: Logger,
    private publisher: EventPublisher,
    private repository: SalesLeadRepository
  ) {}

  async execute(command: FindNewSalesLeadsCommand): Promise<void> {
    let countNewSalesLeads = 0;
    const process$ = this.finders[0].find().pipe(
      tap((salesLeads) => {
        countNewSalesLeads += salesLeads.length;
      }),
      map((found) =>
        found.map((result) =>
          this.publisher.mergeObjectContext(SalesLead.acquired(result))
        )
      ),
      mergeMap((salesLeads) =>
        from(this.repository.save(salesLeads)).pipe(map(() => salesLeads))
      ),
      tap((salesLeads) => salesLeads.forEach((salesLead) => salesLead.commit()))
    );

    return new Promise((resolve, reject) =>
      process$.subscribe(
        (salesLeads) =>
          this.logger.log(
            {
              message: 'Found these sales leads',
              data: { salesLeads },
            },

            'FindNewSalesLeadsHandler'
          ),
        (error) => {
          this.logger.error(
            {
              message: 'An error during looking for sales leads',
              data: { error },
            },
            undefined,

            'FindNewSalesLeadsHandler'
          );

          reject(error);
        },

        () => {
          this.logger.log(
            {
              message: 'Completed searching for sales leads',
              data: { countNewSalesLeads },
            },
            'FindNewSalesLeadsHandler'
          );
          this.eventBus.publish(
            new NewSalesLeadsAcquiredEvent(countNewSalesLeads)
          );
          resolve();
        }
      )
    );
  }
}
