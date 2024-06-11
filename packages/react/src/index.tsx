import clsx from 'clsx';
import { get } from 'lodash';
import { Fragment, cloneElement, createElement, type ReactNode } from 'react';

import {
  GetLinkPreviewResult,
  ListBlockType,
  LocalBlockType,
  LocalIconField,
  LocalImageBlockType,
  WithChildren,
  WithReplacedField,
  richTextToString,
  type RenderConfig,
} from '@nostagik/core';
import {
  BookmarkBlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  ChildPageBlockObjectResponse,
  CodeBlockObjectResponse,
  ColumnBlockObjectResponse,
  ColumnListBlockObjectResponse,
  DividerBlockObjectResponse,
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
  icon: LocalIconField;
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

export function createHeadingRenderer({
  key,
  element,
}: {
  key: 'heading_1' | 'heading_2' | 'heading_3';
  element: keyof HTMLElementTagNameMap;
}) {
  return function HeadingRenderer(block: any, ctx: RendererContext) {
    const { color, is_toggleable, rich_text } = block[key];
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
    block: WithReplacedField<
      BookmarkBlockObjectResponse,
      'bookmark',
      'preview',
      GetLinkPreviewResult
    >,
    ctx: RendererContext
  ) {
    // return null;
    const { preview } = block.bookmark;
    return (
      <a className={blockClsx(ctx, block)} href={block.bookmark.url}>
        <div className={defineBlockClass(ctx, 'bookmark__content')}>
          {preview.title && (
            <h5 className={defineBlockClass(ctx, 'bookmark__title')}>
              {preview.title}
            </h5>
          )}
          {preview.description && <span>{preview.description}</span>}
        </div>
        {preview.images && preview.images[0] && (
          <img
            className={defineBlockClass(ctx, 'bookmark__preview_image')}
            src={preview.images[0]}
            alt={preview.title}
          />
        )}
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
    block: WithReplacedField<
      CalloutBlockObjectResponse,
      'callout',
      'icon',
      LocalIconField
    >,
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
    block: ChildPageBlockObjectResponse & {
      slug: string;
      icon: LocalIconField;
    },
    ctx: RendererContext
  ) {
    return (
      <a className={blockClsx(ctx, block)} href={block.slug}>
        <Icon
          icon={block.icon}
          className={defineBlockClass(ctx, 'child_page__icon')}
        />
        <span className={defineBlockClass(ctx, 'child_page__name')}>
          {block.child_page.title}
        </span>
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

type RendererContext = {
  parent?: LocalBlockType;
  config: RenderConfig;
};

function _renderBlocks(blocks: any[] = [], ctx: RendererContext): ReactNode {
  return blocks.map((block) => {
    if (block === null) {
      return null;
    }
    const renderer = get(renderers, block.type, unimplementedBlockRenderer);
    const result = renderer ? renderer(block, ctx) : null;
    if (result === null)
      return process.env['NODE_ENV'] === 'development'
        ? unimplementedBlockRenderer(block, ctx)
        : null;
    return cloneElement(result, { key: block.id });
  });
}

export function renderBlocks(blocks: LocalBlockType[], config: RenderConfig) {
  return _renderBlocks(blocks, { config });
}
