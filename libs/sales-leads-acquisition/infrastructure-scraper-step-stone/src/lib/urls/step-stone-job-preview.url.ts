import { StepStoneUrl } from './step-stone.url';

export class StepStoneJobPreviewUrl extends StepStoneUrl {
  static job(path: string): StepStoneJobPreviewUrl {
    return StepStoneUrl.homePage().addPath(path);
  }
}
