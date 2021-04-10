import { TinyTypeOf } from 'tiny-types';

const type = Symbol();

export class CompanySize extends TinyTypeOf<string>() {
  private readonly type: typeof type = type;
}
