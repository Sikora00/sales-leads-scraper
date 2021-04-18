import { FindNewSalesLeadsCommand } from '@sales-leads/sales-leads-acquisition/application';
import { IsArray, IsString } from 'class-validator';

export class FindNewSalesLeadsDto implements FindNewSalesLeadsCommand {
  @IsString({ each: true })
  readonly keyWords!: string[];
}
