import { defer, from, Observable, ReplaySubject, Subject } from 'rxjs';
import { SalesLeadData } from '@sales-leads/sales-leads-acquisition/domain';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { StepStoneJobsListUrl } from './urls/step-stone-jobs-list.url';
import { JobsListItem } from './scrapers/jobs-list-page.scraper';

export class ScrapingQueue {
  private tasks$ = new ReplaySubject<Observable<SalesLeadData[]>>();
  private finish$ = new Subject<void>();
  protected src$ = this.tasks$.pipe(mergeMap((command) => command));
  private count = 0;

  addJob(
    url: StepStoneJobsListUrl,
    task: (
      url: StepStoneJobsListUrl,
      iterationService: (jobs: JobsListItem[]) => void
    ) => Promise<SalesLeadData[]>,
    continueIterationPredict: (jobs: JobsListItem[]) => boolean
  ): void {
    this.count++;

    const iterationService = (jobs: JobsListItem[]) => {
      if (continueIterationPredict(jobs)) {
        this.addJob(url.nextPage(), task, continueIterationPredict);
      }
    };
    this.tasks$.next(
      defer(() =>
        from(
          task(url, iterationService).then((result) => {
            this.count--;
            return result;
          })
        )
      )
    );
  }

  getResult(): Observable<SalesLeadData[]> {
    return this.src$.pipe(
      tap((data) => {
        if (this.count <= 0) {
          this.finish$.next();
          this.finish$.complete();
        }
      }),
      takeUntil(this.finish$)
    );
  }
}
