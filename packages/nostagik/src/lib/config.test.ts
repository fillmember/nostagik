import {
  createNostagikConfig,
  defaultNostagikConfig as defaults,
} from './config';

describe('config', () => {
  describe('createNostagikConfig', () => {
    test('should merge recursively', () => {
      const input = { classPrefix: 'yee-' };
      const output = createNostagikConfig(input);
      expect(output.notionAnnotationsClasses).toEqual(
        defaults.notionAnnotationsClasses
      );
      expect(output.fullWidthImageCondition).toEqual(
        defaults.fullWidthImageCondition
      );
      expect(output.notionBlockClasses).toEqual(defaults.notionBlockClasses);
    });
    test('if notionBlockClasses is null', () => {
      const input = { notionBlockClasses: null };
      const output = createNostagikConfig(input);
      expect(output.notionBlockClasses).toBeNull();
    });
  });
});
