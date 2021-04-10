import { Url } from './url';

const type = Symbol();

export class SourceAdvertisement {
  private readonly type: typeof type = type;

  constructor(private readonly url: Url, private readonly title: string) {}
}
