import { Injectable } from '@nestjs/common';
import {
  ISalesLeadsFinder,
  SalesLeadsFinder,
} from '@sales-leads/sales-leads-acquisition/application';
import { SalesLeadData } from '@sales-leads/sales-leads-acquisition/domain';
import { StepStoneJobsListUrl } from './urls/step-stone-jobs-list.url';
import { ScrapingOrchestrator } from './scraping.orchestrator';
import { merge, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
@SalesLeadsFinder
export class SalesLeadsAcquisitionInfrastructureScraperStepStoneService
  implements ISalesLeadsFinder {
  private readonly jobsListUrl = StepStoneJobsListUrl.base();

  constructor(private orchestrator: ScrapingOrchestrator) {}

  find(keyWords: string[]): Observable<SalesLeadData[]> {
    const baseListUrls = keyWords.map((keyWord) =>
      this.jobsListUrl.search(keyWord).sort('date')
    );
    return merge(
      baseListUrls.map((baseListUrl) => this.orchestrator.start(baseListUrl))
    ).pipe(mergeMap((x) => x));
  }
}
