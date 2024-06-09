import 'server-only';

import clsx from 'clsx';
import { get } from 'lodash';
import { Fragment, cloneElement, createElement, type ReactNode } from 'react';

import {
  BookmarkBlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  ChildPageBlockObjectResponse,
  CodeBlockObjectResponse,
  ColumnBlockObjectResponse,
  ColumnListBlockObjectResponse,
  DividerBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  MentionRichTextItemResponse,
  NumberedListItemBlockObjectResponse,
  ParagraphBlockObjectResponse,
  QuoteBlockObjectResponse,
  RichTextItemResponse,
  TableBlockObjectResponse,
  TableRowBlockObjectResponse,
  ToDoBlockObjectResponse,
  ToggleBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import slugify from 'slugify';
import {
  IconField,
  ListBlockType,
  LocalBlockType,
  LocalImageBlockType,
  WithChildren,
} from './types';
import { richTextToString } from './utils';

function blockClsx(
  ctx: RendererContext,
  block: { type: string },
  ...others: clsx.ClassValue[]
) {
  return clsx(
    `${ctx.config.notionBlockClasses.prefix}${block.type}`,
    ctx.config.notionBlockClasses.map[block.type],
    ...others
  );
}

export function Icon({
  icon,
  alt,
  className,
}: {
  icon: IconField;
  alt?: string;
  className?: string;
}) {
  switch (icon?.type) {
    case 'emoji':
      return <span className={className}>{icon.emoji}</span>;
    case 'image':
      return (
        <img
          className={className}
          src={icon.url}
          alt={alt}
          width={icon.dimensions.width}
          height={icon.dimensions.height}
        />
      );
    default:
      return null;
  }
}

function notionAnnotationToClassNames(
  ctx: RendererContext,
  annotations: RichTextItemResponse['annotations']
) {
  return Object.keys(annotations)
    .map((str) => {
      const key = str as keyof typeof annotations;
      if (key === 'color') {
        return notionColorToClassNames(ctx, annotations.color);
      }
      const value = annotations[key];
      if (value) {
        return ctx.config.notionAnnotationsClasses[key];
      }
      return '';
    })
    .join(' ');
}

function notionColorToClassNames(ctx: RendererContext, input = '') {
  const inputArr = input.split(' ');
  const result = clsx(
    inputArr.map(
      (item) => `${ctx.config.notionBlockClasses.prefix}annotation-${item}`
    ),
    inputArr
      .map((item) => ctx.config.notionAnnotationsClasses.color[item])
      .filter(Boolean)
  );
  return result;
}

export function createHeadingRenderer<
  T extends
    | WithChildren<Heading1BlockObjectResponse>
    | WithChildren<Heading2BlockObjectResponse>
    | WithChildren<Heading3BlockObjectResponse>
>({
  key,
  element,
}: {
  key: 'heading_1' | 'heading_2' | 'heading_3';
  element: keyof HTMLElementTagNameMap;
}) {
  return function HeadingRenderer(block: T, ctx: RendererContext) {
    const { color, is_toggleable, rich_text } = get(
      block,
      key
    ) as Heading1BlockObjectResponse['heading_1'];
    const clsHeading = blockClsx(
      ctx,
      block,
      defineBlockClass(ctx, 'heading'),
      notionColorToClassNames(ctx, color)
    );
    const headingContent = _renderBlocks(rich_text, ctx);
    if (!is_toggleable) {
      return createElement(
        element,
        {
          id: slugify(richTextToString(rich_text), { strict: true }),
          className: clsHeading,
        },
        headingContent
      );
    } else {
      return (
        <details>
          <summary className={clsHeading}>{headingContent}</summary>
          <div
            className={clsx(
              defineBlockClass(ctx, `heading__toggle_children`),
              defineBlockClass(ctx, `${key}__toggle_children`)
            )}
          >
            {_renderBlocks(block.children, ctx)}
          </div>
        </details>
      );
    }
  };
}

export const renderers = {
  bookmark: function BookmarkBlock(
    block: BookmarkBlockObjectResponse,
    ctx: RendererContext
  ) {
    return (
      <a
        className={blockClsx(
          ctx,
          block,
          ctx.config.notionBlockClasses.map['link']
        )}
        href={block.bookmark.url}
      >
        {block.bookmark.url}
      </a>
    );
  },
  bulleted_list: function BulletedListBlock(
    block: ListBlockType,
    ctx: RendererContext
  ) {
    return (
      <ul className={blockClsx(ctx, block)}>
        {_renderBlocks(block.children, ctx)}
      </ul>
    );
  },
  bulleted_list_item: function BulletedListItemBlock(
    block: WithChildren<BulletedListItemBlockObjectResponse>,
    ctx: RendererContext
  ) {
    return (
      <li className={blockClsx(ctx, block)}>
        {_renderBlocks(block.bulleted_list_item.rich_text, ctx)}
        {_renderBlocks(block.children, ctx)}
      </li>
    );
  },
  callout: function CalloutBlock(
    block: CalloutBlockObjectResponse,
    ctx: RendererContext
  ) {
    const children = _renderBlocks(block.callout.rich_text, ctx);
    return (
      <div
        className={blockClsx(
          ctx,
          block,
          notionColorToClassNames(ctx, block.callout.color)
        )}
      >
        <Icon
          icon={block.callout.icon}
          className={defineBlockClass(ctx, 'callout__icon')}
        />
        <div>{children}</div>
      </div>
    );
  },
  child_page: function ChildPageBlock(
    block: ChildPageBlockObjectResponse & { slug: string },
    ctx: RendererContext
  ) {
    return (
      <a
        className={blockClsx(
          ctx,
          block,
          ctx.config.notionBlockClasses.map['link']
        )}
        href={block.slug}
      >
        {block.child_page.title}
      </a>
    );
  },
  code: function CodeBlock(
    block: CodeBlockObjectResponse,
    ctx: RendererContext
  ) {
    return (
      <div className={blockClsx(ctx, block)}>
        <pre>
          <code
            data-language={block.code?.language}
            className={block.code?.language}
          >
            {_renderBlocks(block.code?.rich_text, ctx)}
          </code>
        </pre>
        <legend>{_renderBlocks(block.code?.caption, ctx)}</legend>
      </div>
    );
  },
  column: function ColumnBlock(
    block: WithChildren<ColumnBlockObjectResponse>,
    ctx: RendererContext
  ) {
    return (
      <div className={blockClsx(ctx, block)}>
        {_renderBlocks(block.children, ctx)}
      </div>
    );
  },
  column_list: function ColumnListBlock(
    block: WithChildren<ColumnListBlockObjectResponse>,
    ctx: RendererContext
  ) {
    return (
      <section className={blockClsx(ctx, block)}>
        {_renderBlocks(block.children, ctx)}
      </section>
    );
  },
  divider: function DividerBlock(
    block: DividerBlockObjectResponse,
    ctx: RendererContext
  ) {
    return <hr className={blockClsx(ctx, block)} />;
  },
  heading_1: createHeadingRenderer({ key: 'heading_1', element: 'h2' }),
  heading_2: createHeadingRenderer({ key: 'heading_2', element: 'h3' }),
  heading_3: createHeadingRenderer({ key: 'heading_3', element: 'h4' }),
  image: function ImageBlock(block: LocalImageBlockType, ctx: RendererContext) {
    const src = block.image.url;
    const {
      dimensions: { width = 0, height = 0 },
      caption,
    } = block.image;
    const captionElement = _renderBlocks(caption, ctx);
    const alt = richTextToString(caption);
    const { fullWidthImageCondition } = ctx.config;
    return (
      <figure
        className={blockClsx(
          ctx,
          block,
          fullWidthImageCondition(block) &&
            defineBlockClass(ctx, 'image_full_width')
        )}
      >
        <img
          alt={alt}
          src={src}
          width={width}
          height={height}
          className={defineBlockClass(ctx, 'image_img')}
        />
        {captionElement && (
          <figcaption className={defineBlockClass(ctx, 'image__caption')}>
            {captionElement}
          </figcaption>
        )}
      </figure>
    );
  },
  mention: function MentionBlock(
    block: MentionRichTextItemResponse,
    ctx: RendererContext
  ) {
    const { type } = block.mention;
    if (type === 'user') {
      return (
        <span
          className={blockClsx(
            ctx,
            block,
            notionAnnotationToClassNames(ctx, block.annotations)
          )}
        >
          {block.plain_text}
        </span>
      );
    }
    if (type === 'page' && block.href !== null) {
      return (
        <a
          className={blockClsx(
            ctx,
            block,
            ctx.config.notionBlockClasses.map['link']
          )}
          href={block.mention.page.id.replace(/-/g, '')}
        >
          {block.plain_text}
        </a>
      );
    }
    return null;
  },
  numbered_list: function NumberedListBlock(
    block: ListBlockType,
    ctx: RendererContext
  ) {
    return (
      <ol className={blockClsx(ctx, block)}>
        {_renderBlocks(block.children, ctx)}
      </ol>
    );
  },
  numbered_list_item: function NumberedListItemBlock(
    block: WithChildren<NumberedListItemBlockObjectResponse>,
    ctx: RendererContext
  ) {
    return (
      <li className={blockClsx(ctx, block)}>
        {_renderBlocks(block.numbered_list_item.rich_text, ctx)}
        {_renderBlocks(block.children, ctx)}
      </li>
    );
  },
  paragraph: function ParagraphBlock(
    block: ParagraphBlockObjectResponse,
    ctx: RendererContext
  ) {
    return (
      <p className={blockClsx(ctx, block)}>
        {_renderBlocks(block.paragraph.rich_text, ctx)}
      </p>
    );
  },
  quote: function QuoteBlock(
    block: QuoteBlockObjectResponse,
    ctx: RendererContext
  ) {
    return (
      <blockquote className={blockClsx(ctx, block)}>
        {_renderBlocks(block.quote.rich_text, ctx)}
      </blockquote>
    );
  },
  table: function TableBlock(
    block: WithChildren<TableBlockObjectResponse>,
    ctx: RendererContext
  ) {
    return (
      <table className={blockClsx(ctx, block)}>
        {_renderBlocks(block.children, { ...ctx, parent: block })}
      </table>
    );
  },
  table_row: function TableRowBlock(
    block: WithChildren<TableRowBlockObjectResponse>,
    ctx: RendererContext
  ) {
    const { cells } = block.table_row;
    const parent = ctx?.parent as WithChildren<TableBlockObjectResponse>;
    const rowIndex = parent?.children.indexOf(block);
    const isRowHeader = parent?.table.has_row_header && rowIndex === 0;
    const rowElement = (
      <tr className={blockClsx(ctx, block)}>
        {cells.map((cell, cellIndex) => {
          const isColumnHeader =
            parent.table.has_column_header && cellIndex === 0;
          const children = _renderBlocks(cell, ctx);
          return createElement(
            isRowHeader || isColumnHeader ? 'th' : 'td',
            {},
            children
          );
        })}
      </tr>
    );
    return rowElement;
  },
  text: function TextBlock(block: RichTextItemResponse, ctx: RendererContext) {
    const content = block.plain_text
      .split('\n')
      .map((str: string, index: number, arr: string[]) => (
        <Fragment key={index}>
          {str}
          {index + 1 < arr.length && <br />}
        </Fragment>
      ));
    const { href, annotations } = block;
    const clsAnnotation = notionAnnotationToClassNames(ctx, annotations);
    const clsBlock = blockClsx(ctx, block, clsAnnotation);
    if (href) {
      return (
        <a
          className={clsx(clsBlock, ctx.config.notionBlockClasses.map['link'])}
          href={href}
        >
          {content}
        </a>
      );
    }
    if (annotations.code) {
      return <code className={clsBlock}>{content}</code>;
    }
    return <span className={clsBlock}>{content}</span>;
  },
  to_do_list: function ToDoListBlock(
    block: ListBlockType,
    ctx: RendererContext
  ) {
    return (
      <ul className={blockClsx(ctx, block)}>
        {_renderBlocks(block.children, ctx)}
      </ul>
    );
  },
  to_do: function ToDoBlock(
    block: ToDoBlockObjectResponse,
    ctx: RendererContext
  ) {
    const { color, checked, rich_text } = block.to_do;
    return (
      <li
        className={blockClsx(ctx, block, notionColorToClassNames(ctx, color))}
        data-checked={checked}
      >
        <input
          type="checkbox"
          className={defineBlockClass(ctx, 'to_do__checkbox')}
          checked={checked}
          readOnly
        />
        <div>{_renderBlocks(rich_text, ctx)}</div>
      </li>
    );
  },
  toggle: function ToggleBlock(
    block: WithChildren<ToggleBlockObjectResponse>,
    ctx: RendererContext
  ) {
    return (
      <details className={blockClsx(ctx, block)}>
        <summary>{_renderBlocks(block.toggle.rich_text, ctx)}</summary>
        <div className={defineBlockClass(ctx, 'toggle__children')}>
          {_renderBlocks(block.children, ctx)}
        </div>
      </details>
    );
  },
};

function unimplementedBlockRenderer(
  block: LocalBlockType,
  ctx?: RendererContext
) {
  const isDev = process.env['NODE_ENV'] === 'development';
  if (!isDev) return null;
  return (
    <div className="bg-pink-100 p-4 border border-red-200 overflow-auto text-red-600 text-sm space-y-2">
      <h4 className="font-bold">
        No Renderer found for block with type <code>`{block.type}`</code>
      </h4>
      <details>
        <summary>block data</summary>
        <pre className="text-orange-100 bg-red-950 p-2 -mx-2">
          <code>{JSON.stringify(block, null, 2)}</code>
        </pre>
      </details>
      {ctx && (
        <details>
          <summary>render context</summary>
          <pre className="text-orange-100 bg-red-950 p-2 -mx-2">
            <code>{JSON.stringify(ctx, null, 2)}</code>
          </pre>
        </details>
      )}
      <span className="block text-right">
        this is only visible in development mode
      </span>
    </div>
  );
}

function defineBlockClass(ctx: RendererContext, name: string): string {
  const objectClass = `${ctx.config.notionBlockClasses.prefix}${name}`;
  return clsx(objectClass, ctx.config.notionBlockClasses.map[name]);
}

export type RenderBlockConfig = {
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

export const defaultRenderConfig: RenderBlockConfig = {
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
      image_img: 'full',
      image__caption: 'text-sm text-stone-600 mt-2 mb-4',
      image_full_width: 'full page-layout',
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
    return width / height > 3;
  },
};

type RendererContext = {
  parent?: LocalBlockType;
  config: RenderBlockConfig;
};

function _renderBlocks(blocks: any[] = [], ctx: RendererContext): ReactNode {
  return blocks.map((block) => {
    if (block === null) {
      return null;
    }
    const renderer = get(renderers, block.type, unimplementedBlockRenderer);
    const result = renderer
      ? renderer(block, ctx)
      : unimplementedBlockRenderer(block, ctx);
    if (result === null) return null;
    return cloneElement(result, { key: block.id });
  });
}

export function resolveConfig(
  config: Partial<RenderBlockConfig>
): RenderBlockConfig {
  return Object.assign({}, defaultRenderConfig, config) as RenderBlockConfig;
}

export function renderBlocks(
  blocks: LocalBlockType[],
  config: Partial<RenderBlockConfig> = {}
) {
  return _renderBlocks(blocks, { config: resolveConfig(config) });
}
