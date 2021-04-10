import { TinyTypeOf } from 'tiny-types';
import { v4 as uuid } from 'uuid';
export class Uuid extends TinyTypeOf<string>() {
  static generate(): Uuid {
    return new Uuid(uuid());
  }
}
