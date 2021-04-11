import { StepStoneUrl } from './step-stone.url';

export class StepStoneListUrl extends StepStoneUrl {
  static base(): StepStoneListUrl {
    return new StepStoneListUrl(
      'https://www.stepstone.de/5/job-search-simple.html'
    );
  }

  search(key: string): StepStoneListUrl {
    return this.addQueryParam('ke', key) as StepStoneListUrl;
  }

  page(number: number): StepStoneListUrl {
    return this.addQueryParam(
      'of',
      (number * 25).toString()
    ) as StepStoneListUrl;
  }
}
