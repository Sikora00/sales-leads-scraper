import { StepStoneUrl } from './step-stone.url';

export class StepStoneJobsListUrl extends StepStoneUrl {
  static base(): StepStoneJobsListUrl {
    return new StepStoneJobsListUrl(
      'https://www.stepstone.de/5/job-search-simple.html'
    );
  }

  search(key: string): StepStoneJobsListUrl {
    return this.addQueryParam('ke', key) as StepStoneJobsListUrl;
  }

  page(number: number): StepStoneJobsListUrl {
    return this.addQueryParam(
      'of',
      (number * 25).toString()
    ) as StepStoneJobsListUrl;
  }

  sort(by: 'date'): StepStoneJobsListUrl {
    return this.addQueryParam('ob', by) as StepStoneJobsListUrl;
  }

  nextPage(): StepStoneJobsListUrl {
    const currentOffset = this.innerValue.searchParams.get('of') ?? 0;
    return this.addQueryParam(
      'of',
      (+currentOffset + 25).toString()
    ) as StepStoneJobsListUrl;
  }
}
