const type = Symbol();

export class City {
  private readonly type: typeof type = type;
  constructor(private readonly value: string) {}
}
