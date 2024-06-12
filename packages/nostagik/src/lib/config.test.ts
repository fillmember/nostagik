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
      expect(output.notionBlockClasses.map).toEqual(
        defaults.notionBlockClasses.map
      );
    });
  });
});
