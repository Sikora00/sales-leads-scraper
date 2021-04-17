import { StepStoneUrl } from './step-stone.url';

export class StepStoneCompanyUrl extends StepStoneUrl {
  static forCompany(company: string): StepStoneCompanyUrl {
    return new StepStoneCompanyUrl(
      StepStoneUrl.homePage().addPath('/cmp/en').addPath(company).toString()
    );
  }
}
