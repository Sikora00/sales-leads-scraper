import {FindNewSalesLeadsHandler} from './find-new-sales-leads.handler';
import {Test, TestingModule} from '@nestjs/testing';
import {SalesLeadsRepository} from '../../ports/sales-leads.repository';
import {CqrsModule, EventBus, EventPublisher} from '@nestjs/cqrs';
import {createSpyObj} from 'jest-createspyobj';
import {SalesLeadsFindersToken} from '../../ports/sales-leads-finder';
import {FindNewSalesLeadsCommand} from "./find-new-sales-leads.command";

describe('FindNewSalesLeadsHandler', () => {
  let out: FindNewSalesLeadsHandler;
  let sandbox: TestingModule;
  describe('when 10 new sales leads were found', () => {
    beforeAll(async () => {
      sandbox = await fixture.get10NewSalesLeadsSandbox();
      out = sandbox.get(FindNewSalesLeadsHandler);
      await out.execute(new FindNewSalesLeadsCommand())
    });
    it('should save all of them', () => {
      expect(sandbox.get(SalesLeadsRepository).save).toHaveBeenCalledTimes(10);
    });
    it('should publish an event about each sales lead and a summary event', () => {
      expect(sandbox.get(EventBus).publish).toHaveBeenCalledTimes(11);
    });
  });
});

const fixture = {
  get10NewSalesLeadsSandbox: async (): Promise<TestingModule> => {
    return await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        FindNewSalesLeadsHandler,
        {
          provide: SalesLeadsRepository,
          useValue: createSpyObj(SalesLeadsRepository, ['save']),
        },
        {provide: SalesLeadsFindersToken, useValue: [{find: () => Promise.resolve(new Array(10).fill({}))}]},
      ],
    }).overrideProvider(EventBus).useValue(createSpyObj(EventBus)).compile();
  },
};
