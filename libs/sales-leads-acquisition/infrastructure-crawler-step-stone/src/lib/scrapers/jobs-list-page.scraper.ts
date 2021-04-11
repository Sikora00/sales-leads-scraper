import { Scraper } from '../scraper/scraper';
import { StepStoneListUrl } from '../urls/step-stone-list.url';
import { Logger } from '@sales-leads/shared/application';
import { StepStoneJobPreviewUrl } from '../urls/step-stone-job-preview.url';

export const jobsListPageScraperFactory = (
  logger: Logger,
  scraper: Scraper
) => (jobUrl: StepStoneListUrl) =>
  new JobsListPageScraper(logger, scraper, jobUrl);
export type JobsListPageScraperFactory = (
  jobUrl: StepStoneListUrl
) => JobsListPageScraper;

export class JobsListPageScraper {
  constructor(
    private logger: Logger,
    private readonly scraper: Scraper,
    private readonly url: StepStoneListUrl
  ) {}

  async getJobsList(): Promise<JobsListItem[]> {
    const { data } = await this.scraper.scrape<{ jobs: JobListRawItem[] }>(
      this.url,
      {
        jobs: {
          listItem: `div[data-at='job-item']`,
          data: {
            title: 'h2',
            detailsUrl: {
              selector: `a[data-at='job-item-title']`,
              attr: 'href',
            },
          },
        },
      }
    );

    return data.jobs.map((job) => ({
      ...job,
      detailsUrl: StepStoneJobPreviewUrl.job(job.detailsUrl),
    }));
  }

  forNewUrl(url: StepStoneListUrl): JobsListPageScraper {
    return new JobsListPageScraper(this.logger, this.scraper, url);
  }
}

type JobListRawItem = {
  title: string;
  detailsUrl: string;
};

export interface JobsListItem {
  title: string;
  detailsUrl: StepStoneJobPreviewUrl;
}
