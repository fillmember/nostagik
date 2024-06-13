import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';

/**
 *  Useful Utility Types
 */

/**
 * A type to replace a property of a field in a block to a different type. Used a lot to blocks we modified in the stored version of the data.
 */
export type WithReplacedField<
  Type,
  Property extends keyof Type,
  FieldName extends string,
  NewType
> = Omit<Type, Property> & {
  [key in Property]: { [key in FieldName]: NewType } & Omit<
    Type[Property],
    FieldName
  >;
};

/**
 * A type to recursively make all properties partial, and not just the root ones
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
    ? RecursivePartial<T[P]>
    : T[P];
};

export type WithChildren<T, C = unknown> = T & { children: C[] };

/**
 * NotionPageData Types
 */

export type NotionPageData = {
  title: string;
  slug: string;
  cover?: LocalCoverField;
  icon?: LocalIconField;
  blocks: LocalBlockType[];
};

export interface GetNotionPageOption {
  localDataMinimumValidTime: number;
  paths: {
    data: string;
    image: string;
    imagePublicPath: string;
  };
  notionClientAuthToken?: string;
}

/**
 * Field and Property Types
 */

export type TitleProperty = {
  type: 'title';
  title: Array<RichTextItemResponse>;
  id: string;
};

export type LocalImageBlockType = {
  id: string;
  has_children: boolean;
  type: 'image';
  image: {
    type: 'image';
    caption: Array<RichTextItemResponse>;
    url: string;
    dimensions: ISizeCalculationResult;
  };
};

export type ListBlockType<T = unknown> = {
  type: string;
  id: string;
  has_children?: boolean;
  children: T[];
};

export type LocalBlockType =
  | Omit<
      BlockObjectResponse,
      | 'object'
      | 'created_time'
      | 'created_by'
      | 'last_edited_time'
      | 'last_edited_by'
      | 'archived'
      | 'in_trash'
      | 'parent'
    >
  | LocalImageBlockType
  | ListBlockType;

export type LocalCoverField = null | {
  type: 'image';
  url: string;
  dimensions: ISizeCalculationResult;
};

export type NotionCoverField =
  | {
      type: 'external';
      external: {
        url: string;
      };
    }
  | {
      type: 'file';
      file: {
        url: string;
        expiry_time: string;
      };
    }
  | null;

export type LocalIconField =
  | {
      type: 'image';
      url: string;
      dimensions: ISizeCalculationResult;
    }
  | {
      type: 'emoji';
      emoji: string;
    }
  | null;

export type NotionIconField =
  | {
      type: 'emoji';
      emoji: string;
    }
  | {
      type: 'external';
      external: {
        url: string;
      };
    }
  | {
      type: 'file';
      file: {
        url: string;
        expiry_time: string;
      };
    }
  | null;

/**
 * getLinkPreview return type
 *
 * lifted from compiled file of `link-preview-js`
 */

export type GetLinkPreviewResult = {
  url?: string;
  title?: string;
  siteName?: string;
  description?: string;
  mediaType: string;
  contentType?: string;
  images?: string[];
  videos: {
    url?: string;
    secureUrl?: string;
    type?: string;
    width?: string;
    height?: string;
  }[];
  favicons: string[];
  charset?: string;
};

/**
 * BlockRenderer
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type BlockRenderer = Function;
