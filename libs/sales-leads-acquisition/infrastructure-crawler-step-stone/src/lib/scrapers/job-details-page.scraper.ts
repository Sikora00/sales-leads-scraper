import { Scraper } from '../scraper/scraper';
import { StepStoneCompanyJobOffersUrl } from '../urls/step-stone-company-job-offers.url';
import { StepStoneJobPreviewUrl } from '../urls/step-stone-job-preview.url';
import { StepStoneCompanyUrl } from '../urls/step-stone-company.url';
import { Logger } from '@sales-leads/shared/application';

export const JobDetailsPageScraperToken = Symbol();

export const jobDetailsPageScraperFactory = (
  logger: Logger,
  scraper: Scraper
) => (jobUrl: StepStoneJobPreviewUrl) =>
  new JobDetailsPageScraper(logger, scraper, jobUrl);
export type JobDetailsPageScraperFactory = (
  jobUrl: StepStoneJobPreviewUrl
) => JobDetailsPageScraper;

export class JobDetailsPageScraper {
  constructor(
    private logger: Logger,
    private scraper: Scraper,
    private jobUrl: StepStoneJobPreviewUrl
  ) {}

  async getCompanyUrl(): Promise<StepStoneCompanyUrl> {
    const result = await this.scraper
      .scrape<{ url: string }>(this.jobUrl, {
        url: { selector: '.at-header-company-name', attr: 'href' },
      })
      .then(({ data }: { data: { url: string } }) =>
        new StepStoneCompanyJobOffersUrl(data.url).toCompanyPage()
      );

    this.logger.log(
      {
        message: 'getCompanyUrl result',
        data: { jobUrl: this.jobUrl.toString(), companyUrl: result.toString() },
      },
      'JobDetailsPageScraper'
    );

    return result;
  }
}
