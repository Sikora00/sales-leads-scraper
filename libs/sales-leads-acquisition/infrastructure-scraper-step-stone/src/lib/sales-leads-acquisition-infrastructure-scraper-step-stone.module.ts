import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { SalesLeadsAcquisitionInfrastructureScraperStepStoneService } from './sales-leads-acquisition-infrastructure-scraper-step-stone.service';
import { Scraper } from './scraper/scraper';
import { JobDetailsPageScrapersAggregate } from './aggregates/job-details-page-scrapers.aggregate';
import {
  jobDetailsPageScraperFactory,
  JobDetailsPageScraperToken,
} from './scrapers/job-details-page.scraper';
import { Logger } from '@sales-leads/shared/application';
import {
  JobsListPageScraper,
  jobsListPageScraperFactory,
} from './scrapers/jobs-list-page.scraper';
import { CompanyDetailsPageScrapersAggregate } from './aggregates/company-details-page-scrapers.aggregate';
import {
  companyDetailsPageScraperFactory,
  CompanyDetailsPageScraperToken,
} from './scrapers/company-details-page.scraper';
import { ScrapingOrchestrator } from './scraping.orchestrator';

@Module({})
export class SalesLeadsAcquisitionInfrastructureScraperStepStoneModule {
  static withInfrastructure(
    infrastructure: ModuleMetadata['imports']
  ): DynamicModule {
    infrastructure = infrastructure ?? [];
    return {
      module: SalesLeadsAcquisitionInfrastructureScraperStepStoneModule,
      imports: [...infrastructure],
      providers: [
        SalesLeadsAcquisitionInfrastructureScraperStepStoneService,
        Scraper,
        JobDetailsPageScrapersAggregate,
        CompanyDetailsPageScrapersAggregate,
        ScrapingOrchestrator,
        {
          provide: CompanyDetailsPageScraperToken,
          useFactory: companyDetailsPageScraperFactory,
          inject: [Logger, Scraper],
        },
        {
          provide: JobDetailsPageScraperToken,
          useFactory: jobDetailsPageScraperFactory,
          inject: [Logger, Scraper],
        },
        {
          provide: JobsListPageScraper,
          useFactory: jobsListPageScraperFactory,
          inject: [Logger, Scraper],
        },
      ],
      exports: [SalesLeadsAcquisitionInfrastructureScraperStepStoneService],
    };
  }
}
