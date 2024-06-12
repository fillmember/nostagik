import {
  DefaultPageRenderer,
  type DefaultPageRendererProps,
} from '@nostagik/react/src/page';
import nostagikConfig from './nostagikConfig';

export default function NotionPageComponent(
  props: Omit<DefaultPageRendererProps, 'nostagikConfig'>
) {
  return <DefaultPageRenderer nostagikConfig={nostagikConfig} {...props} />;
}
