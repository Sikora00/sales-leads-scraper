import { Scraper } from '../scraper/scraper';
import { StepStoneJobPreviewUrl } from '../urls/step-stone-job-preview.url';
import { StepStoneCompanyUrl } from '../urls/step-stone-company.url';
import { Logger } from '@sales-leads/shared/application';
import { chunk } from '@sales-leads/shared/util-array';

export const CompanyDetailsPageScraperToken = Symbol();

export const companyDetailsPageScraperFactory = (
  logger: Logger,
  scraper: Scraper
) => (jobUrl: StepStoneJobPreviewUrl) =>
  new CompanyDetailsPageScraper(logger, scraper, jobUrl);
export type CompanyDetailsPageScraperFactory = (
  jobUrl: StepStoneJobPreviewUrl
) => CompanyDetailsPageScraper;

export class CompanyDetailsPageScraper {
  constructor(
    private logger: Logger,
    private scraper: Scraper,
    private companyDetailsUrl: StepStoneCompanyUrl
  ) {}

  async getCompanyData(): Promise<CompanyScrapingResult> {
    const result = await this.scraper
      .scrape<CompanyScrapedData>(this.companyDetailsUrl, {
        prop1Key: {
          selector:
            'div[data-block="app-inShort"] div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(1)',
        },
        prop1Value: {
          selector:
            'div[data-block="app-inShort"] div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(2)',
        },
        prop2Key: {
          selector:
            'div[data-block="app-inShort"] div:nth-child(1) div:nth-child(2) div:nth-child(2) div:nth-child(1)',
        },
        prop2Value: {
          selector:
            'div[data-block="app-inShort"] div:nth-child(1) div:nth-child(2) div:nth-child(2) div:nth-child(2)',
        },
        prop3Key: {
          selector:
            'div[data-block="app-inShort"] div:nth-child(1) div:nth-child(2) div:nth-child(3) div:nth-child(1)',
        },
        prop3Value: {
          selector:
            'div[data-block="app-inShort"] div:nth-child(1) div:nth-child(2) div:nth-child(3) div:nth-child(2)',
        },
        prop4Key: {
          selector:
            'div[data-block="app-inShort"] div:nth-child(1) div:nth-child(2) div:nth-child(4) div:nth-child(1)',
        },
        prop4Value: {
          selector:
            'div[data-block="app-inShort"] div:nth-child(1) div:nth-child(2) div:nth-child(4) div:nth-child(2)',
        },
        name: { selector: '.at-company-hub-block-header div:nth-child(2) h1' },
      })
      .then(({ data }) => this.convertScrapedCompanyData(data));
    this.logger.debug(
      {
        message: 'getCompanyData result',
        data: { result, url: this.companyDetailsUrl.toString() },
      },
      'CompanyDetailsPageScraper'
    );

    return result;
  }

  private convertScrapedCompanyData(
    data: CompanyScrapedData
  ): CompanyScrapingResult {
    const result: CompanyScrapingResult = { name: data.name };
    const keyValue: [string, string][] = chunk(
      Object.entries(data)
        .filter(([key, value]: [string, string]) => key !== 'name')
        .map(([key, value]: [string, string]) => value),
      2
    ) as [string, string][];
    keyValue.forEach(([key, value]: [string, string]) => {
      if (key.includes('Website')) {
        result.website = value;
      } else if (key.includes('Address')) {
        result.address = value;
      } else if (key.includes('Size')) {
        result.size = value;
      } else if (key.includes('Industry')) {
        result.industry = value;
      }
    });

    return result;
  }
}

export type CompanyScrapingResult = Partial<{
  website: string;
  address: string;
  size: string;
  industry: string;
}> & { name: string };

type CompanyScrapedData = CompanyInShortResult & { name: string };

type CompanyInShortResult = {
  prop1Key: string;
  prop1Value: string;
  prop2Key: string;
  prop2Value: string;
  prop3Key: string;
  prop3Value: string;
  prop4Key: string;
  prop4Value: string;
};
