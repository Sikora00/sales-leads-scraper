import { chunk } from './chunk';

describe('chunk array', () => {
  test('works', () => {
    expect(chunk(['a', 'b', 'c', 'd', 'e'], 2)).toMatchObject([
      ['a', 'b'],
      ['c', 'd'],
      ['e'],
    ]);
  });
});
