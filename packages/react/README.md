# @nostagik/react

Rendering data grabbed by `@nostagik/core` for React projects.

## Components

### DefaultPageRenderer

Example page in Next.js (App Router)

```jsx
// next way to render a 404 page
import { notFound } from 'next/navigation';
// @nostagik packages
import { createNostagikConfig, getNotionPage } from '@nostagik/core';
import { DefaultPageRenderer } from '@nostagik/react/page';
//
import nostagikConfig from '~/configs/nostagikConfig';
import getPageOptions from '~/configs/options';

export default async function Home() {
  const page = await getNotionPage('...', getPageOptions);
  if (page === null) notFound();
  return <DefaultPageRenderer nostagikConfig={nostagikConfig} {...page} />;
}
```

See [documentation of `@nostagik/core`](https://github.com/fillmember/nostagik/tree/main/packages/nostagik) for information on GetNotionPageOption and NostagikConfig.

### renderBlocks

render blocks into DOM elements.

```jsx
import nostagikConfig from '~/configs/nostagikConfig';

/* ... */
<div>{renderBlocks(blocks, nostagikConfig)}</div>;
```
