import { forEach } from 'lodash';
import { notFound, redirect } from 'next/navigation';
import { getNotionPage, listStoredPages, type NotionPageData } from 'nostagik';
import NotionPageComponent from '../../components/NotionPage';
import { renderConfig } from '../../components/renderConfig';

type Props = { params: { slug: string } };

export default async function NotionPage({ params: { slug } }: Props) {
  const { pairs } = await listStoredPages();
  let pageId;
  forEach(pairs, function (pair) {
    if (slug === pair.hash) {
      return redirect(`/${pair.slug}`);
    } else if (slug === pair.slug) {
      pageId = pair.hash;
    }
  });
  if (!pageId) notFound();
  //
  const props = await getNotionPage(pageId);
  if (props === null) notFound();
  return (
    <NotionPageComponent
      {...props}
      slotBeforePageTitle={
        <nav className="mt-8 -mb-4">
          <a className={renderConfig.notionBlockClasses.map['link']} href="/">
            back to home
          </a>
        </nav>
      }
    />
  );
}

export async function generateStaticParams() {
  const { flat } = await listStoredPages();
  return flat.map((slug) => ({ slug }));
}

export async function generateMetadata({ params: { slug } }: Props) {
  const { pairs } = await listStoredPages();
  let pageId;
  forEach(pairs, function (pair) {
    if (slug === pair.hash) {
      pageId = pair.hash;
    } else if (slug === pair.slug) {
      pageId = pair.hash;
    }
  });
  if (!pageId) notFound();
  const { title } = (await getNotionPage(pageId)) as NotionPageData;
  return { title };
}
