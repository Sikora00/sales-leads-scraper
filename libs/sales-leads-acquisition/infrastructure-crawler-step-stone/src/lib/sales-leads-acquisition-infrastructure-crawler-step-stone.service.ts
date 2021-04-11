import { Inject, Injectable } from '@nestjs/common';
import {
  ISalesLeadsFinder,
  SalesLeadsFinder,
} from '@sales-leads/sales-leads-acquisition/application';
import {
  City,
  CompanySize,
  Country,
  Industry,
  SalesLeadData,
  SourceAdvertisement,
} from '@sales-leads/sales-leads-acquisition/domain';
import { StepStoneListUrl } from './urls/step-stone-list.url';
import { Url } from '@sales-leads/shared/domain-technical';
import { Logger } from '@sales-leads/shared/application';
import { Scraper } from './scraper/scraper';
import { JobDetailsPageScrapersAggregate } from './aggregates/job-details-page-scrapers.aggregate';
import {
  JobsListPageScraper,
  JobsListPageScraperFactory,
} from './scrapers/jobs-list-page.scraper';
import { CompanyDetailsPageScrapersAggregate } from './aggregates/company-details-page-scrapers.aggregate';

@Injectable()
@SalesLeadsFinder
export class SalesLeadsAcquisitionInfrastructureCrawlerStepStoneService
  implements ISalesLeadsFinder {
  private readonly jobsListUrl = StepStoneListUrl.base();

  constructor(
    private companyDetailsPageScrapersAggregate: CompanyDetailsPageScrapersAggregate,
    private readonly scraper: Scraper,
    private jobDetailsPageScrapersAggregate: JobDetailsPageScrapersAggregate,
    @Inject(JobsListPageScraper)
    private jobsListPageScraperFactory: JobsListPageScraperFactory,
    private logger: Logger
  ) {}

  async find(): Promise<SalesLeadData[]> {
    const angularList = this.jobsListUrl.search('NestJS');
    return (
      await Promise.all([
        this.findForUrl(angularList),
        this.findForUrl(angularList.page(2)),
      ])
    ).reduce((results, newResults) => results.concat(newResults), []);
  }

  async findForUrl(url: StepStoneListUrl): Promise<SalesLeadData[]> {
    const jobs = await this.jobsListPageScraperFactory(url).getJobsList();
    const jobsUrls = jobs.map(({ detailsUrl }) => detailsUrl);
    const companiesUrls = await this.jobDetailsPageScrapersAggregate.getCompaniesUrlsFromJobs(
      jobsUrls
    );
    const companyData = await this.companyDetailsPageScrapersAggregate.getCompaniesData(
      companiesUrls
    );
    this.logger.log(
      {
        message: 'Loaded companyData',
        data: { companyData },
      },
      'SalesLeadsAcquisitionInfrastructureCrawlerStepStoneService'
    );

    return companyData.map((companyData, i) => ({
      companyWebsite: companyData.website ? new Url(companyData.website) : null,
      industry: companyData.industry
        ? new Industry(companyData.industry)
        : null,
      companySize: companyData.size ? new CompanySize(companyData.size) : null,
      city: companyData.address
        ? new City(companyData.address.split(', ').slice(-2)[0])
        : null,
      country: companyData.address
        ? new Country(companyData.address.split(', ').pop()!)
        : null,
      sourceAdvertisement: new SourceAdvertisement(jobsUrls[i], jobs[i].title),
      name: companyData.name,
    }));
  }
}
