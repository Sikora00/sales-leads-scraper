import { Scraper } from '../scraper/scraper';
import { StepStoneJobsListUrl } from '../urls/step-stone-jobs-list.url';
import { Logger } from '@sales-leads/shared/application';
import { StepStoneJobPreviewUrl } from '../urls/step-stone-job-preview.url';

export const jobsListPageScraperFactory = (
  logger: Logger,
  scraper: Scraper
) => (jobUrl: StepStoneJobsListUrl) =>
  new JobsListPageScraper(logger, scraper, jobUrl);
export type JobsListPageScraperFactory = (
  jobUrl: StepStoneJobsListUrl
) => JobsListPageScraper;

export class JobsListPageScraper {
  constructor(
    private logger: Logger,
    private readonly scraper: Scraper,
    private readonly url: StepStoneJobsListUrl
  ) {}

  async getJobsList(): Promise<JobsListItem[]> {
    const { data } = await this.scraper.scrape<{ jobs: JobListRawItem[] }>(
      this.url,
      {
        jobs: {
          listItem: `div[class^='Result'] div:nth-child(1) div[data-at='job-item']`,
          data: {
            title: 'h2',
            detailsUrl: {
              selector: `a[data-at='job-item-title']`,
              attr: 'href',
            },
            addedAt: {
              selector: `time`,
            },
          },
        },
      }
    );

    this.logger.debug(
      {
        message: 'getJobsList result',
        data: { url: this.url.toString(), result: data },
      },
      'JobsListPageScraper'
    );

    return data.jobs.map((job) => ({
      ...job,
      detailsUrl: StepStoneJobPreviewUrl.job(job.detailsUrl),
    }));
  }

  forNewUrl(url: StepStoneJobsListUrl): JobsListPageScraper {
    return new JobsListPageScraper(this.logger, this.scraper, url);
  }
}

type JobListRawItem = {
  title: string;
  detailsUrl: string;
  addedAt: string;
};

export interface JobsListItem {
  title: string;
  detailsUrl: StepStoneJobPreviewUrl;
  addedAt: string;
}
