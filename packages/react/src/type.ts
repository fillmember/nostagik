import type { LocalBlockType, NostagikConfig } from '@nostagik/core';

export type RendererContext = {
  parent?: LocalBlockType;
  config: NostagikConfig;
  root: LocalBlockType[];
  renderers: Required<NostagikConfig['blockRenderers']>;
};
