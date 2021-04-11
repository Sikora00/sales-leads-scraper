import { StepStoneCompanyUrl } from './step-stone-company.url';

export class StepStoneCompanyJobOffersUrl extends StepStoneCompanyUrl {
  toCompanyPage(): StepStoneCompanyUrl {
    return new StepStoneCompanyUrl(
      this.innerValue.toString().replace('work.html', '')
    );
  }
}
