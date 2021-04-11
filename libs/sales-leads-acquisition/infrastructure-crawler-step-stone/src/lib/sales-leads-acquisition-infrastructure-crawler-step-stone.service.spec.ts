import { Test } from '@nestjs/testing';
import { SalesLeadsAcquisitionInfrastructureCrawlerStepStoneService } from './sales-leads-acquisition-infrastructure-crawler-step-stone.service';

describe('SalesLeadsAcquisitionInfrastructureCrawlerStepStoneService', () => {
  let service: SalesLeadsAcquisitionInfrastructureCrawlerStepStoneService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SalesLeadsAcquisitionInfrastructureCrawlerStepStoneService],
    }).compile();

    service = module.get(
      SalesLeadsAcquisitionInfrastructureCrawlerStepStoneService
    );
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
