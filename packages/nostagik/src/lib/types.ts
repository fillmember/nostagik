import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';

export type NotionPageData = {
  title: string;
  slug: string;
  cover?: CoverField;
  icon?: IconField;
  blocks: LocalBlockType[];
};

export type WithChildren<T, C = unknown> = T & { children: C[] };

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

export type CoverField =
  | { type: 'image'; url: string; dimensions: ISizeCalculationResult }
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

export type IconField =
  | { type: 'image'; url: string; dimensions: ISizeCalculationResult }
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
