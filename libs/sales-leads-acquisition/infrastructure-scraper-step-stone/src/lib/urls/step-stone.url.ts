import { Url } from '@sales-leads/shared/domain-technical';

export class StepStoneUrl extends Url {
  static homePage(): StepStoneUrl {
    return new StepStoneUrl('https://www.stepstone.de/');
  }
}
