import { SalesLeadRepository } from '@sales-leads/sales-leads-acquisition/application';
import { EntityRepository } from '@mikro-orm/core';
import { SalesLeadEntity } from '../entities/sales-lead.entity';
import { SalesLead } from '@sales-leads/sales-leads-acquisition/domain';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Url } from '@sales-leads/shared/domain-technical';

export class MikroOrmSalesLeadRepository implements SalesLeadRepository {
  constructor(
    @InjectRepository(SalesLeadEntity)
    private mikroOrmRepo: EntityRepository<SalesLeadEntity>
  ) {}

  async find(leadUrl: Url): Promise<SalesLead | undefined> {
    const entity = await this.mikroOrmRepo.findOne(leadUrl.toString());
    return entity?.toSalesLead();
  }

  save(salesLeads: SalesLead | SalesLead[]): Promise<void> {
    if (Array.isArray(salesLeads)) {
      salesLeads
        .map((salesLead) => SalesLeadEntity.fromSalesLead(salesLead))
        .forEach((salesLead) => this.mikroOrmRepo.persist(salesLead));
      return this.mikroOrmRepo.flush();
    } else {
      return this.mikroOrmRepo.persistAndFlush(
        SalesLeadEntity.fromSalesLead(salesLeads as SalesLead)
      );
    }
  }
}
