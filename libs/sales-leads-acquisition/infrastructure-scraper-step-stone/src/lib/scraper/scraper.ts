import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as scrapeIt from 'scrape-it';
import { Url } from '@sales-leads/shared/domain-technical';
import { defer, from, Observable, Subject, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class Scraper implements OnModuleDestroy {
  private headers = {
    'user-agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
    'accept-language': 'en-US,en;q=0.9,pl;q=0.8,de;q=0.7',
  };

  private tasks$ = new Subject<Observable<void>>();
  protected src$ = this.tasks$.pipe(mergeMap((command) => command, 20));
  private sub: Subscription;

  constructor() {
    this.sub = this.src$.subscribe();
  }

  scrape<T>(
    url: Url,
    opts: scrapeIt.ScrapeOptions
  ): Promise<scrapeIt.ScrapeResult<T>> {
    return new Promise((resolve) => {
      this.tasks$.next(
        defer(() =>
          from(
            scrapeIt<T>(
              { url: url.toString(), headers: this.headers },
              opts
            ).then(resolve)
          )
        )
      );
    });
  }

  onModuleDestroy(): void {
    this.sub.unsubscribe();
  }
}
