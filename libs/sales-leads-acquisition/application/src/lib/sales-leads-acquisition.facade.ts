import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class SalesLeadsAcquisitionFacade {
  constructor(private commandBus: CommandBus) {}

  acquired(): Promise<void> {}
}
