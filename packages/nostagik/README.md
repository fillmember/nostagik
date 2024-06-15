# @nostagik/core

The package handles pulling data from Notion. And the basic

## API Reference

### createNostagikConfig

creates a complete config for Nostagik to find and render content from Notion data.

```typescript
const config = createNostagikConfig({
  // pages: list the entrypoint(s) of the content on Notion
  pages: [
    { id: 'xxxxxxxxxxxxxxxxxxxx', path: '/' }, // specify path to be able to easily grab this entry (e.g. via Array.find)
  ],
  // classPrefix: render packages (e.g. @nostagik/react) define `class` property for each block. The class names are prefixed with `classPrefix`
  classPrefix: 'nk-',
  // notionBlockClasses: apart from the above mentioned "nk-[block]", extra classes can be specified under `notionBlockClasses` and will be added to the class property. This allows using/disabling TailwindCSS without writing custom block renderers.
  notionBlockClasses: {
    paragraph: 'text-sm',
  },
  // notionAnnotationsClasses: the same idea of `notionBlockClasses`, but applied to annotations of the rich_text objects.
  notionAnnotationsClasses: {
    /* ... */
  },
  // fullWidthImageCondition: the public Notion API does not return some layout information used in Notion. This is Nostagik's way to layout an image block as a full-width block.
  fullWidthImageCondition(block) {
    const { width = 0, height = 0 } = block.image.dimensions;
    return width / height > 2.25;
  },
});
```

The config option is of type `NostagikConfig` ([source](https://github.com/fillmember/nostagik/blob/main/packages/nostagik/src/lib/config.ts))

Refer to [Get Started](https://nostagik.pages.dev/get-started) for configuring Nostagik.

### getNotionPage

Call the Notion API and get one single page by id. The result is locally cached and may be used for subsequent calls.

```typescript
const result = getNotionPage('YOUR_PAGE_ID', options);
```

#### Parameters

| #   | name   | type                |          | description                                |
| --- | ------ | ------------------- | -------- | ------------------------------------------ |
| 1   | id     | string              | required | id of the page                             |
| 2   | option | GetNotionPageOption | required | options to customize the fetching behavior |

The following can be configured in the option:

| name                      | type   | default      | description                              |
| ------------------------- | ------ | ------------ | ---------------------------------------- |
| notionClientAuthToken     | string | **required** | the token used to fetch data from notion |
| localDataMinimumValidTime | number | 600          | unit: seconds.                           |
| paths                     | object | ...          | see [Customization](https://nostagik.pages.dev/get-started#Configure-data-paths) for more information   |

#### Return Value

an object of type `NotionPageData` consists of the following properties:

| property |          | type             | description                                              |
| -------- | -------- | ---------------- | -------------------------------------------------------- |
| title    |          | string           | title of the page in Notion                              |
| slug     |          | string           | created from title                                       |
| blocks   |          | LocalBlockType[] | content of the page in Notion                            |
| cover    | optional | LocalCoverField  | locally stored cover image and its metadata              |
| icon     | optional | LocalIconField   | locally stored icon image (or an emoji) and its metadata |

### getAllPages

Call the Notion API and retrieve the pages listed in the nostagik config file, as well as the child pages of the listed pages. The result is locally cached and may be used for subsequent calls or as result of `getNotionPage` method.

```typescript
const pages = getAllPages(nostagikConfig, option);
```

#### Parameters

| #   | name   | type                |          | description                                          |
| --- | ------ | ------------------- | -------- | ---------------------------------------------------- |
| 1   | config | NostagikConfig      | required | the config object returned by `createNostagikConfig` |
| 2   | option | GetNotionPageOption | required | the option object also used in `getNotionPage`       |

#### Return Value

The method returns an array of `{ id: string; slug: string; }` object. The object also contain properties specified in `NostagikConfig.pages`, the data is merged by matching `id`.

### richTextToString

A helper function that turns an array of [rich text](https://developers.notion.com/reference/rich-text) objects into a string.

```typescript
const str = richTextToString(arrayOfRichTextItemResponse);
```

---
