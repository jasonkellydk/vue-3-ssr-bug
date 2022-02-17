import { renderToString } from 'vue/server-renderer';
import type { App } from 'vue';

export function createServerSideRender(
  createApp: () => App
) {
  return async (data: { url: string; manifest: Record<string, string[]>;}) => {
    const app = await createApp();

    const context: Record<string, any> = {};
    const html = await renderToString(app, context);
    const preloadLinks = renderModulesPreload(context.modules, data.manifest)

    return {
      appHtml: html,
      preloadLinks,
    };
  };
}

function renderModulesPreload(modules: string[], manifest: Record<string, string[]>): string {
  let links = '';
  const seen = new Set();
  modules.forEach((id) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file);
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
}

function renderPreloadLink(file: string) {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin="anonymous" href="${file}" />`;
  } else if (file.endsWith('.css')) {
    return `<link rel="preload" href="${file}" as="style"/> <link rel="stylesheet" href="${file}" />`;
  } else if (file.endsWith('.woff')) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin="anonymous" />`;
  } else if (file.endsWith('.woff2')) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin="anonymous" />`;
  } else if (file.endsWith('.gif')) {
    return `<link rel="preload" href="${file}" as="image" type="image/gif" />`;
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return `<link rel="preload" href="${file}" as="image" type="image/jpeg" />`;
  } else if (file.endsWith('.png')) {
    return `<link rel="preload" href="${file}" as="image" type="image/png" />`;
  } else {
    // TODO
    return '';
  }
}
