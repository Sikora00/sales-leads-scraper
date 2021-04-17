import { CompanyScrapingResult } from './scrapers/company-details-page.scraper';
import { JobsListItem } from './scrapers/jobs-list-page.scraper';
import {
  City,
  CompanySize,
  Country,
  Industry,
  SalesLeadData,
  SourceAdvertisement,
} from '@sales-leads/sales-leads-acquisition/domain';
import { Url } from '@sales-leads/shared/domain-technical';

export class ScrapeResultMapper {
  static map(
    data: {
      companyData: CompanyScrapingResult;
      job: JobsListItem;
    }[]
  ): SalesLeadData[] {
    return data.map(({ companyData, job }) => ({
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
      sourceAdvertisement: new SourceAdvertisement(job.detailsUrl, job.title),
      name: companyData.name,
    }));
  }
}
