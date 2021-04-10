const type = Symbol();

export class Country {
  private readonly type: typeof type = type;

  constructor(private readonly value: string) {}
}
