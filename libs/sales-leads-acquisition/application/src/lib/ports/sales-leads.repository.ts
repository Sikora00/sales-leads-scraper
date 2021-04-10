import { SalesLead } from '@sales-leads/sales-leads-acquisition/domain';

export abstract class SalesLeadsRepository {
  abstract save(salesLead: SalesLead): Promise<void>;
}
