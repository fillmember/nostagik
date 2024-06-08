import { groupItemsBy } from './utils';

describe('utils', () => {
  describe('groupItemsBy', () => {
    test('should group items', () => {
      const input = [
        { type: 'a' },
        { type: 'a' },
        { type: 'a' },
        { type: 'b' },
        { type: 'b' },
        { type: 'a' },
        { type: 'b' },
      ];
      const expected = [
        {
          type: 'group',
          children: [{ type: 'a' }, { type: 'a' }, { type: 'a' }],
        },
        { type: 'b' },
        { type: 'b' },
        {
          type: 'group',
          children: [{ type: 'a' }],
        },
        { type: 'b' },
      ];
      const result = groupItemsBy(
        input,
        (item) => item.type === 'a',
        (items) => ({ type: 'group', children: items })
      );
      expect(result).toEqual(expected);
    });
  });
});
