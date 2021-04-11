import { Injectable } from '@nestjs/common';
import * as scrapeIt from 'scrape-it';
import { Url } from '@sales-leads/shared/domain-technical';

@Injectable()
export class Scraper {
  private headers = {
    'user-agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
    'accept-language': 'en-US,en;q=0.9,pl;q=0.8,de;q=0.7',
  };

  scrape<T>(
    url: Url,
    opts: scrapeIt.ScrapeOptions
  ): Promise<scrapeIt.ScrapeResult<T>> {
    return scrapeIt<T>({ url: url.toString(), headers: this.headers }, opts);
  }
}
