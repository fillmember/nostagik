import { notFound } from 'next/navigation';
import NotionPageComponent from '../notion/NotionPage';
import { getNotionPage } from '../notion/getData';

const pageId = '957d69b81d0d406a967b969f1a88e81f';

export default async function Home() {
  const props = await getNotionPage(pageId);
  if (props === null) notFound();
  return <NotionPageComponent {...props} />;
}
