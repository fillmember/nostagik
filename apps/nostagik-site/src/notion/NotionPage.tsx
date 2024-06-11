import clsx from 'clsx';
import { NotionPageData, renderBlocks } from 'nostagik';
import { renderConfig } from './renderConfig';
import { type ReactNode } from 'react';
import Link from 'next/link';

export default function NotionPageComponent({
  title,
  icon,
  cover,
  blocks,
  slotBeforePageTitle,
}: NotionPageData & { slotBeforePageTitle?: ReactNode }) {
  return (
    <main className="page-layout">
      <header
        className={clsx(
          'col-span-full page-layout space-y-6',
          !cover && 'pt-20'
        )}
      >
        {cover && (
          <div
            className="col-span-full mb-6 overflow-hidden bg-cover bg-center h-64"
            style={{ backgroundImage: `url(${cover.url})` }}
          />
        )}
        <div className="col-start-2">
          {icon?.type === 'image' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={title}
              src={icon.url}
              width={icon.dimensions?.width}
              height={icon.dimensions?.height}
              className={clsx('w-40 aspect-square mx-0', cover && '-mt-20')}
            />
          )}
          {icon?.type === 'emoji' && (
            <div className={clsx('text-7xl', cover && '-mt-[0.8em]')}>
              {icon.emoji}
            </div>
          )}
          {slotBeforePageTitle}
          <h1 className="text-4xl font-bold mt-8 mb-4 text-slate-950">
            {title}
          </h1>
        </div>
      </header>
      <div className="contents [&>*]:col-start-2 space-y-6">
        {renderBlocks(blocks, renderConfig)}
      </div>
      <footer className="col-span-full bg-slate-100 text-slate-600 mt-12 py-8 page-layout">
        <section className="col-start-2">
          <h4 className="font-bold mb-4">Nostagik</h4>
          <nav className="grid gap-2">
            <Link
              className={renderConfig.notionBlockClasses.map['link']}
              href="/"
            >
              Home
            </Link>
            <a
              className={renderConfig.notionBlockClasses.map['link']}
              href="https://github.com/fillmember/nostagik"
            >
              GitHub
            </a>
          </nav>
        </section>
      </footer>
    </main>
  );
}