import clsx from 'clsx';
import NextLink from 'next/link';
import nostagikConfig from '../notion/nostagikConfig';
import { HTMLProps } from 'react';

export function Link({
  href,
  className,
  ...rest
}: HTMLProps<HTMLAnchorElement>) {
  const cls = clsx(nostagikConfig.notionBlockClasses?.['link'], className);
  if (typeof href === 'string' && href.indexOf('http') === 0) {
    // external link
    return <a className={cls} href={href} {...rest} />;
  }
  if (href) {
    return <NextLink className={cls} href={href} {...rest} />;
  }
  return null;
}
