import { Test } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SalesLeadsAcquisitionInfrastructureMikroOrmModule } from '../../sales-leads-acquisition-infrastructure-mikro-orm.module';
import {
  City,
  CompanySize,
  Country,
  Industry,
  SalesLead,
  SourceAdvertisement,
} from '@sales-leads/sales-leads-acquisition/domain';
import { Url } from '@sales-leads/shared/domain-technical';
import { INestApplication } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { join } from 'path';

export class Fixtures {
  static async getSandbox(): Promise<INestApplication> {
    const module = Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          dbName: join(__dirname, 'db.sqlite'),
          type: 'sqlite',
          autoLoadEntities: true,
        }),
        SalesLeadsAcquisitionInfrastructureMikroOrmModule,
      ],
    });
    const sandbox = await module.compile();
    return sandbox.createNestApplication();
  }

  static async buildSchema(sandbox: INestApplication): Promise<void> {
    const orm = sandbox.get(MikroORM);
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
  }

  static getSampleSalesLead(): SalesLead {
    return SalesLead.restore({
      city: new City('Warsaw'),
      companySize: new CompanySize('50-100'),
      companyWebsite: new Url('https://valueadd.pl'),
      country: new Country('PL'),
      industry: new Industry('IT'),
      name: 'ValueAdd',
      sourceAdvertisement: new SourceAdvertisement(
        new Url('https://valueadd.pl/career'),
        'NestJS Developer'
      ),
    });
  }

  static async dropDb(sandbox: INestApplication): Promise<void> {
    const orm = sandbox.get(MikroORM);
    const generator = orm.getSchemaGenerator();
    await generator.dropSchema();
  }
}
