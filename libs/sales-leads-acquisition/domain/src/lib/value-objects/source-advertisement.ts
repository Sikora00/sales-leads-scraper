import { Url } from '@sales-leads/shared/domain-technical';

const type = Symbol();

export class SourceAdvertisement {
  private readonly type: typeof type = type;

  constructor(public readonly url: Url, public readonly title: string) {}
}
