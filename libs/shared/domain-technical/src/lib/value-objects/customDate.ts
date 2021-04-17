import { ensure, isDefined, Predicate, TinyTypeOf } from 'tiny-types';
import { isDateString } from 'class-validator';

const type = Symbol();

export class CustomDate extends TinyTypeOf<string>() {
  private readonly type: typeof type = type;
  private readonly innerValue: Date;

  constructor(value: string) {
    super(value);
    ensure(
      this.constructor.name,
      value,
      isDefined(),
      Predicate.to(`be an ISO Date`, isDateString)
    );
    this.innerValue = new Date(value);
  }

  toString(): string {
    return this.value;
  }

  static now(): CustomDate {
    return new CustomDate(new Date().toISOString());
  }

  past(): CustomDate {
    const date = new Date(this.innerValue);
    date.setDate(date.getDate() - 1);
    return new CustomDate(date.toISOString());
  }

  isBefore(date: CustomDate): boolean {
    return this.innerValue <= date.innerValue;
  }
}
