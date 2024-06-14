import { DefaultPageRenderer } from '@nostagik/react/src/page';
import { notFound } from 'next/navigation';
import { getNotionPage } from '../notion/getData';
import nostagikConfig from '../notion/nostagikConfig';

export default async function Home() {
  const props = await getNotionPage('957d69b81d0d406a967b969f1a88e81f');
  if (props === null) notFound();
  return <DefaultPageRenderer nostagikConfig={nostagikConfig} {...props} />;
}
