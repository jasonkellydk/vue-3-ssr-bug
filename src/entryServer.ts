import {createApp} from './createApp';
import {createServerSideRender} from "./ssr/createServerSideRender";

export async function render({
                               url,
                               manifest,
                             }: {
  url: string;
  manifest: Record<string, string[]>;
}) {
  const renderFunction = createServerSideRender(createApp);
  return renderFunction({url, manifest});
}
