export interface Child<T, Args extends unknown[]> {
  new (...args: Args): T;
}
