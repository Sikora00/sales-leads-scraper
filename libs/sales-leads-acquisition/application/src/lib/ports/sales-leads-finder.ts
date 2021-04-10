import { Type } from '@nestjs/common';
import { SalesLeadData } from '@sales-leads/sales-leads-acquisition/domain';

export const finders = new Set<Type<ISalesLeadsFinder>>();

export const SalesLeadsFindersToken = Symbol('SalesLeadsFindersToken');

export interface ISalesLeadsFinder {
  find(): Promise<SalesLeadData[]>;
}

export function SalesLeadsFinder(target: Type<ISalesLeadsFinder>): void {
  finders.add(<Type<ISalesLeadsFinder>>target);
}
