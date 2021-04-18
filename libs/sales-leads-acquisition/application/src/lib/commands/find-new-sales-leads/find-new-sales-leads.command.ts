import { ICommand } from '@nestjs/cqrs';

export class FindNewSalesLeadsCommand implements ICommand {
  constructor(public readonly keyWords: string[]) {}
}
