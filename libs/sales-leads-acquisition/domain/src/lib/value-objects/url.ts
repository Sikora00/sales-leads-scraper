const type = Symbol();

export class Url {
  private readonly type: typeof type = type;
  private readonly value: URL;

  constructor(value: string) {
    this.value = new URL(value);
  }
}
