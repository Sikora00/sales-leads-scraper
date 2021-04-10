const type = Symbol();

export class Industry {
  private readonly type: typeof type = type;

  constructor(private readonly value: string) {}
}
