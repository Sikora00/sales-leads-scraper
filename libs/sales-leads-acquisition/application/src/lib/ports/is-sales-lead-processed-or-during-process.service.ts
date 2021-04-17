import { Url } from '@sales-leads/shared/domain-technical';

export abstract class IsSalesLeadProcessedOrDuringProcessService {
  abstract check(leadUrl: Url): Promise<boolean>;
}
