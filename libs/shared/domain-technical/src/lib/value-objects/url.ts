import { ensure, isDefined, Predicate, TinyTypeOf } from 'tiny-types';
import { Class } from 'utility-types';
import { isURL } from 'class-validator';

const type = Symbol();

export class Url extends TinyTypeOf<string>() {
  public readonly innerValue: URL;
  private readonly type: typeof type = type;

  constructor(value: string) {
    super(value);
    ensure(
      this.constructor.name,
      value,
      isDefined(),
      Predicate.to(`be an URL`, isURL)
    ),
      (this.innerValue = new URL(value));
  }

  toString(): string {
    return this.innerValue.toString();
  }

  addPath(path: string): Url {
    const newUrl = new URL(this.innerValue.toString());
    newUrl.pathname = `${newUrl.pathname.slice(0, -1)}${path}`;
    return new (this.constructor as Class<Url>)(newUrl.toString());
  }

  addQueryParam(key: string, value: string): Url {
    const newUrl = new URL(this.innerValue.toString());
    newUrl.searchParams.has(key)
      ? newUrl.searchParams.set(key, value)
      : newUrl.searchParams.append(key, value);
    return new (this.constructor as Class<Url>)(newUrl.toString());
  }
}
