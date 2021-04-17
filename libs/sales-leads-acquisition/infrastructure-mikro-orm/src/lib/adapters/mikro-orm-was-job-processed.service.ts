import { WasJobAlreadyProcessedService } from '@sales-leads/sales-leads-acquisition/application';
import { EntityRepository } from '@mikro-orm/core';
import { SalesLeadEntity } from '../entities/sales-lead.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Url } from '@sales-leads/shared/domain-technical';

export class MikroOrmWasJobProcessedService
  implements WasJobAlreadyProcessedService {
  constructor(
    @InjectRepository(SalesLeadEntity)
    private mikroOrmRepo: EntityRepository<SalesLeadEntity>
  ) {}

  async check(sourceAdvertisementUrl: Url): Promise<boolean> {
    return !!(await this.mikroOrmRepo.findOne({
      sourceAdvertisementUrl: sourceAdvertisementUrl.toString(),
    }));
  }
}
