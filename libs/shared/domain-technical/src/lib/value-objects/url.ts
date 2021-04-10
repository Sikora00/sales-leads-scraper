import { TinyTypeOf } from 'tiny-types';

const type = Symbol();

export class Url extends TinyTypeOf<URL>() {
  private readonly type: typeof type = type;

  constructor(value: string) {
    super(new URL(value));
  }

  toString(): string {
    return this.value.toString();
  }
}
