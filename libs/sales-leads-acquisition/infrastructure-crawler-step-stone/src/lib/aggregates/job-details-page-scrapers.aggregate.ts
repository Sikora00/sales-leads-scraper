import { Inject, Injectable } from '@nestjs/common';
import { Url } from '@sales-leads/shared/domain-technical';
import {
  JobDetailsPageScraperFactory,
  JobDetailsPageScraperToken,
} from '../scrapers/job-details-page.scraper';
import { Logger } from '@sales-leads/shared/application';

@Injectable()
export class JobDetailsPageScrapersAggregate {
  constructor(
    private logger: Logger,
    @Inject(JobDetailsPageScraperToken)
    private scraperFactory: JobDetailsPageScraperFactory
  ) {}

  async getCompaniesUrlsFromJobs(jobsUrls: Url[]): Promise<Url[]> {
    const result = await Promise.all(
      jobsUrls.map((jobUrl) => this.scraperFactory(jobUrl).getCompanyUrl())
    );

    this.logger.log(
      {
        message: 'getCompaniesUrlsFromJobs result',
        data: { result },
      },
      'JobDetailsPageScrapersAggregate'
    );
    return result;
  }
}
