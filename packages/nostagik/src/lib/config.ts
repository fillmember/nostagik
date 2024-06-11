import { merge } from 'lodash';
import { LocalImageBlockType, RecursivePartial } from './types';

export type RenderConfig = {
  notionBlockClasses: {
    prefix: string;
    map: Record<string, string>;
  };
  notionAnnotationsClasses: {
    bold: string;
    italic: string;
    strikethrough: string;
    underline: string;
    code: string;
    color: Record<string, string>;
  };
  fullWidthImageCondition: (block: LocalImageBlockType) => boolean;
};

export const defaultRenderConfig: RenderConfig = {
  notionBlockClasses: {
    prefix: 'nk-',
    map: {
      paragraph: 'text-slate-700',
      // headings
      heading: 'text-slate-800',
      heading_1: 'text-3xl font-bold mb-6',
      heading_2: 'text-2xl font-bold mb-4',
      heading_3: 'text-lg font-bold mb-2',
      // heading toggle blocks
      heading__toggle_children: 'mt-2 mb-8',
      heading_1__toggle_children: 'ml-8',
      heading_2__toggle_children: 'ml-7',
      heading_3__toggle_children: 'ml-5',
      // image
      image: '',
      image_img: 'col-span-full',
      image__caption: 'text-sm text-slate-500 mt-2 mb-4',
      image_full_width: '!col-start-1 col-span-full [&_figcaption]:mx-4',
      // column
      column_list: 'flex gap-8 my-4',
      column: 'flex-1',
      // lists
      bulleted_list: 'list-disc ml-6 my-2',
      numbered_list: 'list-decimal ml-6 my-2',
      to_do_list: 'my-2 space-y-2',
      to_do: 'list-none flex gap-2',
      to_do__checkbox: 'w-[1em] h-[1em] transform translate-y-[0.25em]',
      // toggle blocks
      toggle__children: 'ml-[1.25rem] mt-1',
      // others
      link: 'underline decoration-stone-300 hover:decoration-sky-300 text-stone-600 hover:text-sky-600',
      quote: 'p-4 border bg-gray-50',
      callout: 'flex items-center gap-4 p-4',
      callout__icon: 'text-xl',
      code: 'p-4 text-sm bg-gray-100',
      divider: 'border-t my-12',
      table:
        'border [&_td]:p-2 [&_th]:p-2 [&_th]:text-left [&_th]:bg-gray-100 [&_tr]:border-b [&_tr>*]:border-r',
      // bookmark
      bookmark: 'flex justify-between border border-gray-300',
      bookmark__content: 'p-4 text-gray-500 text-sm',
      bookmark__title: 'text-base text-gray-700 font-bold mb-2',
      bookmark__preview_image: 'max-h-40 -m-px',
      // child_page
      child_page: 'group text-stone-600 hover:text-sky-600',
      child_page__icon: 'pr-1.5',
      child_page__name:
        'underline decoration-stone-300 group-hover:decoration-sky-300',
    },
  },
  notionAnnotationsClasses: {
    bold: 'nk-text-bold font-bold',
    italic: 'nk-text-italic italic',
    strikethrough: 'nk-text-strikethrough line-through',
    underline: 'nk-text-underline underline',
    code: 'nk-inline-code font-mono text-slate-700',
    color: {
      blue: 'nk-blue text-blue-700',
      blue_background: 'nk-blue_background bg-blue-100',
      brown: 'nk-brown text-brown-700',
      brown_background: 'nk-brown_background bg-brown-100',
      gray: 'nk-gray text-gray-700',
      gray_background: 'nk-gray_background bg-gray-100',
      green: 'nk-green text-green-700',
      green_background: 'nk-green_background bg-green-100',
      orange: 'nk-orange text-orange-700',
      orange_background: 'nk-orange_background bg-orange-100',
      pink: 'nk-pink text-pink-700',
      pink_background: 'nk-pink_background bg-pink-100',
      purple: 'nk-purple text-purple-700',
      purple_background: 'nk-purple_background bg-purple-100',
      red: 'nk-red text-red-700',
      red_background: 'nk-red_background bg-red-100',
      yellow: 'nk-yellow text-yellow-700',
      yellow_background: 'nk-yellow_background bg-yellow-100',
    },
  },
  fullWidthImageCondition: (block) => {
    const { width = 0, height = 0 } = block.image.dimensions;
    return width / height > 2.25;
  },
};

export function createRenderConfig(
  config: RecursivePartial<RenderConfig>
): RenderConfig {
  return merge(defaultRenderConfig, config) as RenderConfig;
}
