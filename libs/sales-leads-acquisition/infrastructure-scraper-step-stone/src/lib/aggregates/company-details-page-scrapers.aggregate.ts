import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@sales-leads/shared/application';
import {
  CompanyDetailsPageScraperFactory,
  CompanyDetailsPageScraperToken,
  CompanyScrapingResult,
} from '../scrapers/company-details-page.scraper';
import { StepStoneCompanyUrl } from '../urls/step-stone-company.url';

@Injectable()
export class CompanyDetailsPageScrapersAggregate {
  constructor(
    private logger: Logger,
    @Inject(CompanyDetailsPageScraperToken)
    private scraperFactory: CompanyDetailsPageScraperFactory
  ) {}

  async getCompaniesData(
    companiesUrls: StepStoneCompanyUrl[]
  ): Promise<CompanyScrapingResult[]> {
    const result = await Promise.all(
      companiesUrls.map((companyUrl) =>
        this.scraperFactory(companyUrl).getCompanyData()
      )
    );

    this.logger.debug(
      {
        message: 'getCompaniesData result',
        data: { result },
      },
      'CompanyDetailsPageScrapersAggregate'
    );
    return result;
  }
}
