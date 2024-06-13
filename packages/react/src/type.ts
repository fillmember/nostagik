import type { LocalBlockType, NostagikConfig } from '@nostagik/core';

export type RendererContext = {
  parent?: LocalBlockType;
  config: NostagikConfig;
  renderers: Required<NostagikConfig['blockRenderers']>;
};
