import { Fixtures } from './__test__/fixtures';
import { SalesLeadRepository } from '@sales-leads/sales-leads-acquisition/application';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { SalesLeadEntity } from '../entities/sales-lead.entity';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { INestApplication } from '@nestjs/common';

describe('MikroOrmSalesLeadRepository Integration', () => {
  let sandbox: INestApplication;
  beforeAll(async () => {
    sandbox = await Fixtures.getSandbox();
    await Fixtures.buildSchema(sandbox);
  });
  describe('when saving new sales lead', () => {
    beforeAll(async () => {
      return new Promise((resolve) => {
        RequestContext.create(sandbox.get(MikroORM).em, async () => {
          const repository = sandbox.get(SalesLeadRepository);
          await repository.save(Fixtures.getSampleSalesLead());
          resolve();
        });
      });
    });
    test('new record should be saved in the database', async () => {
      const orm: MikroORM<SqliteDriver> = sandbox.get(MikroORM);
      expect(await orm.em.find(SalesLeadEntity, {})).toMatchSnapshot();
    });
  });

  afterAll(async () => {
    await Fixtures.dropDb(sandbox);
    await sandbox.close();
  });
});
