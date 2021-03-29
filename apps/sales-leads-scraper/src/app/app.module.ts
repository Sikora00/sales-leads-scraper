import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesLeadsScraperKernelModule } from '@sales-leads/sales-leads-scraper/kernel';

@Module({
  imports: [SalesLeadsScraperKernelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
