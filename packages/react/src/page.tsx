import { NostagikConfig, NotionPageData } from '@nostagik/core';
import clsx from 'clsx';
import Image from 'next/image';
import { type ReactNode } from 'react';
import { renderBlocks } from '.';

export type DefaultPageRendererProps = NotionPageData & {
  nostagikConfig: NostagikConfig;
  slotBeforePageTitle?: ReactNode;
  slotFooter?: ReactNode;
};

export function DefaultPageRenderer({
  title,
  icon,
  cover,
  blocks,
  slotBeforePageTitle,
  slotFooter,
  nostagikConfig,
}: DefaultPageRendererProps) {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-1">
        <section className="nostagik-default-page-layout">
          <header
            className={clsx(
              'col-span-full nostagik-default-page-layout space-y-6',
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
                <Image
                  alt={title}
                  src={icon.url}
                  width={icon.dimensions?.width}
                  height={icon.dimensions?.height}
                  className={clsx('w-40 aspect-square mx-0', cover && '-mt-20')}
                />
              )}
              {icon?.type === 'emoji' && (
                <div className={clsx('text-7xl', cover && '-mt-20')}>
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
            {renderBlocks(blocks, nostagikConfig)}
          </div>
        </section>
      </div>
      {slotFooter}
    </main>
  );
}
