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

function blockClsx(block: { type: string }, ...others: clsx.ClassValue[]) {
  return clsx(`nk-${block.type}`, ...others);
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

function notionColorToClassNames(input = '', defaultClassNames = '') {
  const _map: Record<string, string> = {
    default: '',
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
  };
  const result = clsx(
    input
      .split(' ')
      .map((item) => _map[item])
      .filter(Boolean)
  );
  return result || defaultClassNames;
}

export function createHeadingRenderer<
  T extends
    | WithChildren<Heading1BlockObjectResponse>
    | WithChildren<Heading2BlockObjectResponse>
    | WithChildren<Heading3BlockObjectResponse>
>({
  key,
  element,
  className,
}: {
  key: 'heading_1' | 'heading_2' | 'heading_3';
  element: keyof HTMLElementTagNameMap;
  className: string;
}) {
  return function HeadingRenderer(block: T) {
    const { color, is_toggleable, rich_text } = get(
      block,
      key
    ) as Heading1BlockObjectResponse['heading_1'];
    const clsHeading = blockClsx(
      block,
      className,
      notionColorToClassNames(color, 'text-stone-700')
    );
    const headingContent = renderBlocks(rich_text);
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
          <div className="ml-4">{renderBlocks(block.children)}</div>
        </details>
      );
    }
  };
}

export const renderers = {
  bookmark: function BookmarkBlock(block: BookmarkBlockObjectResponse) {
    return (
      <a className={blockClsx(block, 'link')} href={block.bookmark.url}>
        {block.bookmark.url}
      </a>
    );
  },
  bulleted_list: function BulletedListBlock(block: ListBlockType) {
    return (
      <ul className={blockClsx(block, 'list-disc ml-6 my-2')}>
        {renderBlocks(block.children)}
      </ul>
    );
  },
  bulleted_list_item: function BulletedListItemBlock(
    block: WithChildren<BulletedListItemBlockObjectResponse>
  ) {
    return (
      <li className={blockClsx(block)}>
        {renderBlocks(block.bulleted_list_item.rich_text)}
        {renderBlocks(block.children)}
      </li>
    );
  },
  callout: function CalloutBlock(block: CalloutBlockObjectResponse) {
    const children = renderBlocks(block.callout.rich_text);
    return (
      <div
        className={blockClsx(
          block,
          'flex items-center gap-4 p-4',
          notionColorToClassNames(block.callout.color)
        )}
      >
        <Icon icon={block.callout.icon} className="text-xl" />
        <div>{children}</div>
      </div>
    );
  },
  child_page: function ChildPageBlock(
    block: ChildPageBlockObjectResponse & { slug: string }
  ) {
    return (
      <a className={blockClsx(block, 'block link')} href={block.slug}>
        {block.child_page.title}
      </a>
    );
  },
  code: function CodeBlock(block: CodeBlockObjectResponse) {
    return (
      <div className={blockClsx(block, 'p-4 text-sm bg-gray-100')}>
        <pre>
          <code
            data-language={block.code?.language}
            className={block.code?.language}
          >
            {renderBlocks(block.code?.rich_text)}
          </code>
        </pre>
        <legend>{renderBlocks(block.code?.caption)}</legend>
      </div>
    );
  },
  column: function ColumnBlock(block: WithChildren<ColumnBlockObjectResponse>) {
    return (
      <div className={blockClsx(block, 'flex-1')}>
        {renderBlocks(block.children)}
      </div>
    );
  },
  column_list: function ColumnListBlock(
    block: WithChildren<ColumnListBlockObjectResponse>
  ) {
    return (
      <section className={blockClsx(block, 'flex gap-8 my-4')}>
        {renderBlocks(block.children)}
      </section>
    );
  },
  divider: function DividerBlock(block: DividerBlockObjectResponse) {
    return <hr className={blockClsx(block, 'border-t my-12')} />;
  },
  heading_1: createHeadingRenderer({
    key: 'heading_1',
    element: 'h2',
    className: 'text-3xl font-bold mb-6',
  }),
  heading_2: createHeadingRenderer({
    key: 'heading_2',
    element: 'h3',
    className: 'text-2xl font-bold mb-4',
  }),
  heading_3: createHeadingRenderer({
    key: 'heading_3',
    element: 'h4',
    className: 'text-lg font-bold mb-2',
  }),
  image: function ImageBlock(block: LocalImageBlockType) {
    const src = block.image.url;
    const {
      dimensions: { width = 0, height = 0 },
      caption,
    } = block.image;
    const captionElement = renderBlocks(caption);
    const alt = richTextToString(caption);
    return (
      <figure
        className={blockClsx(block, width / height > 3.5 && 'full page-layout')}
      >
        <img
          alt={alt}
          src={src}
          width={width}
          height={height}
          className="full"
        />
        {captionElement && (
          <figcaption className="text-sm text-stone-600 mt-2 mb-4">
            {captionElement}
          </figcaption>
        )}
      </figure>
    );
  },
  mention: function MentionBlock(block: MentionRichTextItemResponse) {
    const { annotations } = block;
    const { type } = block.mention;
    if (type === 'user') {
      return (
        <span
          className={blockClsx(
            block,
            annotations.bold && 'font-bold',
            annotations.italic && 'italic',
            annotations.strikethrough && 'line-through',
            annotations.underline && 'underline',
            notionColorToClassNames(annotations.color) || 'text-gray-500'
          )}
        >
          {block.plain_text}
        </span>
      );
    }
    if (type === 'page' && block.href !== null) {
      return (
        <a
          className={blockClsx(block, 'link')}
          href={block.mention.page.id.replace(/-/g, '')}
        >
          {block.plain_text}
        </a>
      );
    }
    return null;
  },
  numbered_list: function NumberedListBlock(block: ListBlockType) {
    return (
      <ol className={blockClsx(block, 'list-decimal ml-6 my-2')}>
        {renderBlocks(block.children)}
      </ol>
    );
  },
  numbered_list_item: function NumberedListItemBlock(
    block: WithChildren<NumberedListItemBlockObjectResponse>
  ) {
    return (
      <li className={blockClsx(block, 'list-decimal')}>
        {renderBlocks(block.numbered_list_item.rich_text)}
        {renderBlocks(block.children)}
      </li>
    );
  },
  paragraph: function ParagraphBlock(block: ParagraphBlockObjectResponse) {
    return (
      <p className={blockClsx(block, 'max-w-3xl')}>
        {renderBlocks(block.paragraph.rich_text)}
      </p>
    );
  },
  quote: function QuoteBlock(block: QuoteBlockObjectResponse) {
    return (
      <blockquote className={blockClsx(block, 'p-4 border bg-gray-50')}>
        {renderBlocks(block.quote.rich_text)}
      </blockquote>
    );
  },
  table: function TableBlock(block: WithChildren<TableBlockObjectResponse>) {
    return (
      <table className={blockClsx(block)}>
        {renderBlocks(block.children, { parent: block })}
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
      <tr className={blockClsx(block)}>
        {cells.map((cell, cellIndex) => {
          const isColumnHeader =
            parent.table.has_column_header && cellIndex === 0;
          const children = renderBlocks(cell);
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
  text: function TextBlock(block: RichTextItemResponse) {
    const content = block.plain_text
      .split('\n')
      .map((str: string, index: number, arr: string[]) => (
        <Fragment key={index}>
          {str}
          {index + 1 < arr.length && <br />}
        </Fragment>
      ));
    const { href, annotations } = block;
    if (href) {
      return (
        <a className={blockClsx(block, 'link')} href={href}>
          {content}
        </a>
      );
    }
    if (annotations.code) {
      return (
        <code className={blockClsx(block, 'nk-inline-code', 'text-slate-600')}>
          {content}
        </code>
      );
    }
    return (
      <span
        className={blockClsx(
          block,
          annotations.bold && 'nk-text-bold font-bold',
          annotations.italic && 'nk-text-italic italic',
          annotations.strikethrough && 'nk-text-strikethrough line-through',
          annotations.underline && 'nk-text-underline underline',
          notionColorToClassNames(annotations.color)
        )}
      >
        {content}
      </span>
    );
  },
  to_do_list: function ToDoListBlock(block: ListBlockType) {
    return (
      <ul className={blockClsx(block, 'my-2 space-y-2')}>
        {renderBlocks(block.children)}
      </ul>
    );
  },
  to_do: function ToDoBlock(block: ToDoBlockObjectResponse) {
    const { color, checked, rich_text } = block.to_do;
    return (
      <li
        className={blockClsx(
          block,
          'list-none flex gap-2',
          notionColorToClassNames(color)
        )}
        data-checked={checked}
      >
        <input
          type="checkbox"
          className="w-[1em] h-[1em] transform translate-y-[0.25em]"
          checked={checked}
          readOnly
        />
        <div>{renderBlocks(rich_text)}</div>
      </li>
    );
  },
  toggle: function ToggleBlock(block: WithChildren<ToggleBlockObjectResponse>) {
    return (
      <details className={blockClsx(block)}>
        <summary>{renderBlocks(block.toggle.rich_text)}</summary>
        <div className="nk-toggle-children ml-[1.25rem] mt-1">
          {renderBlocks(block.children)}
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
    <div className="bg-pink-100 p-2 overflow-auto text-red-600 text-sm space-y-2">
      <h4 className="font-bold">
        No Renderer found for block with type <code>`{block.type}`</code>
      </h4>
      <pre className="text-orange-100 bg-red-950 p-2 -mx-2">
        <code>{JSON.stringify(block, null, 2)}</code>
      </pre>
      {ctx && (
        <>
          <h5>renderer context:</h5>
          <pre className="text-orange-100 bg-red-950 p-2 -mx-2">
            <code>{JSON.stringify(ctx, null, 2)}</code>
          </pre>
        </>
      )}
      <span className="block text-right">
        this is only visible in development mode
      </span>
    </div>
  );
}

type RendererContext = { parent: LocalBlockType };

export function renderBlocks(
  blocks: any[] = [],
  ctx?: RendererContext
): ReactNode {
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
