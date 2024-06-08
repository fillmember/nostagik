import clsx from 'clsx';
import { renderBlocks } from 'nostagik';
import { ReactNode } from 'react';

export default function NotionPageComponent({
  title,
  icon,
  cover,
  blocks,
  slotBeforePageTitle,
}: {
  title: any;
  icon?: any;
  cover?: any;
  blocks: any;
  slotBeforePageTitle?: ReactNode;
}) {
  return (
    <main className="page-layout space-y-4 mb-24">
      <header className={clsx('page-header page-layout', !cover && 'pt-20')}>
        {cover && (
          <div
            className="page-cover full"
            style={{ backgroundImage: `url(${cover.url})` }}
          />
        )}
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
            {icon.value}
          </div>
        )}
        {slotBeforePageTitle}
        <h1 className="text-4xl font-bold mt-8 mb-4 text-slate-950">{title}</h1>
      </header>
      {renderBlocks(blocks)}
    </main>
  );
}
