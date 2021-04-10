const type = Symbol();

export class CompanySize {
  private readonly type: typeof type = type;

  constructor(private readonly value: string) {}
}
