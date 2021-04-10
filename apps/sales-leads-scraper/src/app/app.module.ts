import { Module } from '@nestjs/common';
import { SalesLeadsScraperKernelModule } from '@sales-leads/sales-leads-scraper/kernel';
import { SalesLeadsAcquisitionUiCloudFunctionModule } from '@sales-leads/sales-leads-acquisition/ui-cloud-function';

@Module({
  imports: [
    SalesLeadsAcquisitionUiCloudFunctionModule,
    SalesLeadsScraperKernelModule,
  ],
})
export class AppModule {}
