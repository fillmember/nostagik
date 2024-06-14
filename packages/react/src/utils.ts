import clsx from 'clsx';

import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { RendererContext } from './type';

export function blockClsx(
  ctx: RendererContext,
  block: { type: string },
  ...others: clsx.ClassValue[]
) {
  return clsx(
    `${ctx.config.classPrefix}${block.type}`,
    ctx.config.notionBlockClasses?.[block.type],
    ...others
  );
}

export function notionAnnotationToClassNames(
  ctx: RendererContext,
  annotations: RichTextItemResponse['annotations']
) {
  return clsx(
    Object.keys(annotations).map((str) => {
      const key = str as keyof typeof annotations;
      if (key === 'color') {
        return notionColorToClassNames(ctx, annotations.color);
      }
      const value = annotations[key];
      if (value) {
        return clsx(
          `${ctx.config.classPrefix}text-${key}`,
          ctx.config.notionAnnotationsClasses?.[key]
        );
      }
      return '';
    })
  );
}

export function notionColorToClassNames(ctx: RendererContext, input = '') {
  const inputArr = input.split(' ');
  const result = clsx(
    inputArr.map((item) =>
      item ? `${ctx.config.classPrefix}annotation-${item}` : null
    ),
    inputArr
      .map((item) => ctx.config.notionAnnotationsClasses?.color[item])
      .filter(Boolean)
  );
  return result;
}

export function defineBlockClass(ctx: RendererContext, name: string): string {
  const objectClass = `${ctx.config.classPrefix}${name}`;
  return clsx(objectClass, ctx.config.notionBlockClasses?.[name]);
}
