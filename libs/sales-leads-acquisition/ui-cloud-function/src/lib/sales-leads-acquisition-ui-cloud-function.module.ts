import { Module } from '@nestjs/common';

import { SalesLeadsAcquisitionUiCloudFunctionController } from './sales-leads-acquisition-ui-cloud-function.controller';
import { SalesLeadsAcquisitionShellModule } from '@sales-leads/sales-leads-acquisition/shell';

@Module({
  imports: [SalesLeadsAcquisitionShellModule],
  controllers: [SalesLeadsAcquisitionUiCloudFunctionController],
})
export class SalesLeadsAcquisitionUiCloudFunctionModule {}
