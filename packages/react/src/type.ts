import type { LocalBlockType, RenderConfig } from '@nostagik/core';

export type RendererContext = {
  parent?: LocalBlockType;
  config: RenderConfig;
};
