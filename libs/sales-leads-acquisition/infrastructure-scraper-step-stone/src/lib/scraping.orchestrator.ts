import { StepStoneJobsListUrl } from './urls/step-stone-jobs-list.url';
import {
  JobsListItem,
  JobsListPageScraper,
  JobsListPageScraperFactory,
} from './scrapers/jobs-list-page.scraper';
import { SalesLeadData } from '@sales-leads/sales-leads-acquisition/domain';
import { ScrapeResultMapper } from './scrape-result.mapper';
import { CompanyDetailsPageScrapersAggregate } from './aggregates/company-details-page-scrapers.aggregate';
import { JobDetailsPageScrapersAggregate } from './aggregates/job-details-page-scrapers.aggregate';
import { Inject, Injectable } from '@nestjs/common';
import { ScrapingQueue } from './scraping-queue';
import {
  IsSalesLeadProcessedOrDuringProcessService,
  WasJobAlreadyProcessedService,
} from '@sales-leads/sales-leads-acquisition/application';
import { filterAsync } from '@sales-leads/shared/util-array';
import { defer, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Url } from '@sales-leads/shared/domain-technical';

@Injectable()
export class ScrapingOrchestrator {
  constructor(
    private companyDetailsPageScrapersAggregate: CompanyDetailsPageScrapersAggregate,
    private jobDetailsPageScrapersAggregate: JobDetailsPageScrapersAggregate,
    @Inject(JobsListPageScraper)
    private jobsListPageScraperFactory: JobsListPageScraperFactory,
    private jobsFilter: WasJobAlreadyProcessedService,
    private isSalesLeadProcessedOrDuringProcessService: IsSalesLeadProcessedOrDuringProcessService
  ) {}

  start(startUrl: StepStoneJobsListUrl): Observable<SalesLeadData[]> {
    const queue = new ScrapingQueue();
    return defer(() => {
      queue.addJob(
        startUrl,
        this.findForUrl.bind(this),
        ScrapingOrchestrator.scrapeNextListPrediction
      );
      return of(null);
    }).pipe(switchMap(() => queue.getResult()));
  }

  private async findForUrl(
    url: StepStoneJobsListUrl,
    pagesIterationService: (jobs: JobsListItem[]) => void
  ): Promise<SalesLeadData[]> {
    let jobs = await this.jobsListPageScraperFactory(url).getJobsList();
    pagesIterationService(jobs);
    jobs = await filterAsync(
      jobs,
      async (job) => !(await this.jobsFilter.check(job.detailsUrl))
    );
    const jobsUrls = jobs.map(({ detailsUrl }) => detailsUrl);
    const companiesUrls = await this.jobDetailsPageScrapersAggregate.getCompaniesUrlsFromJobs(
      jobsUrls
    );
    const companyData = await this.companyDetailsPageScrapersAggregate.getCompaniesData(
      companiesUrls
    );

    const data = await filterAsync(
      jobs.map((job, i) => ({
        job,
        companyData: companyData[i],
      })),
      async ({ companyData }) =>
        !!companyData.website &&
        !(await this.isSalesLeadProcessedOrDuringProcessService.check(
          new Url(companyData.website)
        ))
    );

    return ScrapeResultMapper.map(data);
  }

  private static scrapeNextListPrediction(jobs: JobsListItem[]): boolean {
    const looksLikeThereAreMoreJobs = jobs.length >= 25;
    const jobsAreNotOlderThanOneDay = jobs[jobs.length - 1].addedAt.includes(
      'hours'
    );
    return looksLikeThereAreMoreJobs && jobsAreNotOlderThanOneDay;
  }
}
