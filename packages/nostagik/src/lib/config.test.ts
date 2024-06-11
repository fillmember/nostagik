import { createRenderConfig, defaultRenderConfig } from './config';

describe('config', () => {
  describe('createRenderConfig', () => {
    test('should merge recursively', () => {
      const input = { classPrefix: 'yee-' };
      const output = createRenderConfig(input);
      expect(output.notionAnnotationsClasses).toEqual(
        defaultRenderConfig.notionAnnotationsClasses
      );
      expect(output.fullWidthImageCondition).toEqual(
        defaultRenderConfig.fullWidthImageCondition
      );
      expect(output.notionBlockClasses.map).toEqual(
        defaultRenderConfig.notionBlockClasses.map
      );
    });
  });
});
