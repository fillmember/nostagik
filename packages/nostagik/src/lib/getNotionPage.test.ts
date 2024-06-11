import {
  resolveGetNotionPageOption,
  defaultGetNotionPageOption,
} from './getNotionPage';

jest.mock('server-only', () => ({}));

describe('getNotionPage', () => {
  describe('config', () => {
    describe('resolveGetNotionPageOption', () => {
      test('should merge recursively', () => {
        const input = { paths: { data: './yee/yee/yee' } };
        const output = resolveGetNotionPageOption(input);
        expect(output.paths.data).toBe(input.paths.data);
        expect(output.paths.image).toBe(defaultGetNotionPageOption.paths.image);
        expect(output.localDataMinimumValidTime).toBe(
          defaultGetNotionPageOption.localDataMinimumValidTime
        );
      });
    });
  });
});
