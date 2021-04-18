import { IsSalesLeadProcessedOrDuringProcessService } from '@sales-leads/sales-leads-acquisition/application';
import { EntityRepository } from '@mikro-orm/core';
import { SalesLeadEntity } from '../entities/sales-lead.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Url } from '@sales-leads/shared/domain-technical';

export class MikroOrmIsSalesLeadProcessedOrDuringProcessService
  implements IsSalesLeadProcessedOrDuringProcessService {
  private readonly cache: Record<string, boolean> = {};
  constructor(
    @InjectRepository(SalesLeadEntity)
    private mikroOrmRepo: EntityRepository<SalesLeadEntity>
  ) {}

  async check(leadUrl: Url): Promise<boolean> {
    if (this.cache[leadUrl.toString()]) {
      return true;
    } else {
      this.cache[leadUrl.toString()] = true;
    }
    return !!(await this.mikroOrmRepo.findOne(leadUrl.toString()));
  }
}
