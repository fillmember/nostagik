import { type NotionPageData } from '@nostagik/core';
import { DefaultPageRenderer } from '@nostagik/react/src/page';
import { notFound, redirect } from 'next/navigation';
import { getAllPages, getNotionPage } from '../../notion/getData';
import nostagikConfig from '../../notion/nostagikConfig';

type Props = { params: { slug: string } };

export default async function Page({ params: { slug } }: Props) {
  const pages = await getAllPages();
  let pageId;
  pages.forEach(function (pair) {
    if (slug === pair.id) {
      return redirect(`/${pair.slug}`);
    } else if (slug === pair.slug) {
      pageId = pair.id;
    }
  });
  if (!pageId) notFound();
  //
  const props = await getNotionPage(pageId);
  if (props === null) notFound();
  return (
    <DefaultPageRenderer
      {...props}
      nostagikConfig={nostagikConfig}
      slotBeforePageTitle={
        <nav className="mt-8 -mb-4">
          <a className={nostagikConfig.notionBlockClasses['link']} href="/">
            back to home
          </a>
        </nav>
      }
    />
  );
}

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.filter((p) => p.path !== '/').map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params: { slug } }: Props) {
  const pages = await getAllPages();
  let pageId;
  pages.forEach(function (pair) {
    if (slug === pair.id || slug === pair.slug) {
      pageId = pair.id;
    }
  });
  if (!pageId) notFound();
  const { title } = (await getNotionPage(pageId)) as NotionPageData;
  return { title };
}
