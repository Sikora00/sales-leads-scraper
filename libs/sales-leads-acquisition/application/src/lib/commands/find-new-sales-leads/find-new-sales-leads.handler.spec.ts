import { FindNewSalesLeadsHandler } from './find-new-sales-leads.handler';
import { Test, TestingModule } from '@nestjs/testing';
import { SalesLeadRepository } from '../../ports/sales-lead.repository';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { createSpyObj } from 'jest-createspyobj';
import { SalesLeadsFindersToken } from '../../ports/sales-leads-finder';
import { FindNewSalesLeadsCommand } from './find-new-sales-leads.command';
import { Logger } from '@sales-leads/shared/application';
import { of } from 'rxjs';

describe('FindNewSalesLeadsHandler', () => {
  let out: FindNewSalesLeadsHandler;
  let sandbox: TestingModule;
  describe('when 10 new sales leads were found', () => {
    beforeAll(async () => {
      sandbox = await fixture.get10NewSalesLeadsSandbox();
      out = sandbox.get(FindNewSalesLeadsHandler);
      await out.execute(new FindNewSalesLeadsCommand(['Angular']));
    });
    it('should save all of them in one transaction', () => {
      const repository: jest.Mocked<SalesLeadRepository> = sandbox.get(
        SalesLeadRepository
      );
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ length: 10 })
      );
    });
    it('should publish an event about each sales lead and a summary event', () => {
      expect(sandbox.get(EventBus).publish).toHaveBeenCalledTimes(11);
    });
  });
});

const fixture = {
  get10NewSalesLeadsSandbox: async (): Promise<TestingModule> => {
    const sandbox = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        FindNewSalesLeadsHandler,
        {
          provide: SalesLeadRepository,
          useValue: createSpyObj(SalesLeadRepository, ['save']),
        },
        {
          provide: SalesLeadsFindersToken,
          useValue: [{ find: () => of(new Array(10).fill({})) }],
        },
        {
          provide: Logger,
          useValue: createSpyObj(Logger, ['log', 'error']),
        },
      ],
    })
      .overrideProvider(EventBus)
      .useValue(createSpyObj(EventBus))
      .compile();

    (sandbox.get(
      SalesLeadRepository
    ) as jest.Mocked<SalesLeadRepository>).save.mockResolvedValue(undefined);
    return sandbox;
  },
};
