import { LoggerService } from '@nestjs/common';

export type Message =
  | string
  | { message: string; data: Record<string, unknown>; stack?: unknown };

export abstract class Logger implements LoggerService {
  abstract debug(message: Message, context?: string): void;

  abstract error(message: Message, trace?: string, context?: string): void;

  abstract log(message: Message, context?: string): void;

  abstract verbose(message: Message, context?: string): void;

  abstract warn(message: Message, context?: string): void;
}
