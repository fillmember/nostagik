import { createRenderConfig } from '@nostagik/core';
import * as utils from './utils';

describe('utils', () => {
  test('blockClsx', () => {
    expect(
      utils.blockClsx(
        {
          config: createRenderConfig({
            classPrefix: 'pf-',
            notionBlockClasses: { map: { yee: 'abc' } },
          }),
        },
        { type: 'yee' }
      )
    ).toBe('pf-yee abc');
  });
  //
  test('notionAnnotationToClassNames', () => {
    expect(
      utils.notionAnnotationToClassNames(
        {
          config: createRenderConfig({
            classPrefix: 'aa-',
            notionAnnotationsClasses: {
              bold: '',
              underline: 'uuu',
              color: { brown: 'test-brown' },
            },
          }),
        },
        {
          bold: true,
          code: false,
          italic: false,
          strikethrough: false,
          underline: true,
          color: 'brown',
        }
      )
    ).toBe('aa-text-bold aa-text-underline uuu aa-annotation-brown test-brown');
  });
});
