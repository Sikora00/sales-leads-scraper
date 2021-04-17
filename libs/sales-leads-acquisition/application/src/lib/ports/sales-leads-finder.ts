import { Type } from '@nestjs/common';
import { SalesLeadData } from '@sales-leads/sales-leads-acquisition/domain';
import { Observable } from 'rxjs';

export const finders = new Set<Type<ISalesLeadsFinder>>();

export const SalesLeadsFindersToken = Symbol('SalesLeadsFindersToken');

export interface ISalesLeadsFinder {
  find(): Observable<SalesLeadData[]>;
}

export function SalesLeadsFinder(target: Type<ISalesLeadsFinder>): void {
  finders.add(<Type<ISalesLeadsFinder>>target);
}
