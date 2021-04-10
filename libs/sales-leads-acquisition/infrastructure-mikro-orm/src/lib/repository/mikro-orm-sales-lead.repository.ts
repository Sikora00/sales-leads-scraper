import { SalesLeadRepository } from '@sales-leads/sales-leads-acquisition/application';
import { EntityRepository } from '@mikro-orm/core';
import { SalesLeadEntity } from '../entities/sales-lead.entity';
import { SalesLead } from '@sales-leads/sales-leads-acquisition/domain';
import { InjectRepository } from '@mikro-orm/nestjs';

export class MikroOrmSalesLeadRepository implements SalesLeadRepository {
  constructor(
    @InjectRepository(SalesLeadEntity)
    private mikroOrmRepo: EntityRepository<SalesLeadEntity>
  ) {}
  save(salesLead: SalesLead): Promise<void> {
    return this.mikroOrmRepo.persistAndFlush(
      SalesLeadEntity.fromSalesLead(salesLead)
    );
  }
}
