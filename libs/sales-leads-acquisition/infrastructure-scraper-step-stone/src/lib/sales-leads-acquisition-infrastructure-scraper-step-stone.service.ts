import { Injectable } from '@nestjs/common';
import {
  ISalesLeadsFinder,
  SalesLeadsFinder,
} from '@sales-leads/sales-leads-acquisition/application';
import { SalesLeadData } from '@sales-leads/sales-leads-acquisition/domain';
import { StepStoneJobsListUrl } from './urls/step-stone-jobs-list.url';
import { ScrapingOrchestrator } from './scraping.orchestrator';
import { Observable } from 'rxjs';

@Injectable()
@SalesLeadsFinder
export class SalesLeadsAcquisitionInfrastructureScraperStepStoneService
  implements ISalesLeadsFinder {
  private readonly jobsListUrl = StepStoneJobsListUrl.base();

  constructor(private orchestrator: ScrapingOrchestrator) {}

  find(): Observable<SalesLeadData[]> {
    const baseListUrl = this.jobsListUrl.search('Angular').sort('date');
    return this.orchestrator.start(baseListUrl);
  }
}
