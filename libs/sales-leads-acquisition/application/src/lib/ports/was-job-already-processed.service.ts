import { Url } from '@sales-leads/shared/domain-technical';

export abstract class WasJobAlreadyProcessedService {
  abstract check(sourceAdvertisementUrl: Url): Promise<boolean>;
}
