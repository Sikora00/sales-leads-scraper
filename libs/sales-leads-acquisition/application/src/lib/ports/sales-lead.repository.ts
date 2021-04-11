import { SalesLead } from '@sales-leads/sales-leads-acquisition/domain';

export abstract class SalesLeadRepository {
  abstract save(salesLeads: SalesLead | SalesLead[]): Promise<void>;
}
