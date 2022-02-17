import fastify from 'fastify';
import fastifyExpress from 'fastify-express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

export const createResolve = (root: string) => (pathToResolve: string) =>
  path.resolve(root, pathToResolve);

export async function runDevServer({ root }: { root: string }) {
  const app = fastify();
  const resolve = createResolve(root);
  await app.register(fastifyExpress);

  const viteServer = await createViteServer({
    logLevel: 'info',
    server: {
      middlewareMode: 'ssr',
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  });

  app.use(viteServer.middlewares);

  app.get('*', async (request, response) => {
    try {
      const url = request.url;

      const rawHtml = fs.readFileSync(resolve('index.html'), 'utf-8');
      const template = await viteServer.transformIndexHtml(url, rawHtml);
      const entryServer = await viteServer.ssrLoadModule(resolve('src/entryServer.ts'));

      const { appHtml } = await entryServer.render({
        url,
        manifest: {},
      });

      const html = template
        .replace(`{{app}}`, appHtml);
      response.status(200).headers({ 'Content-Type': 'text/html' }).send(html);
    } catch (error: unknown) {
      console.error(error);
      response.status(500).send((error as Error).stack);
    }
  });

  const start = async () => {
    try {
      const serverHost = process.env.HOST ?? '0.0.0.0';
      const serverPort = process.env.PORT ?? 3000;
      await app.listen(serverPort, serverHost);
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };

  await start();
}

runDevServer({ root: process.cwd() }).catch((error) => console.error('this is not the server you are looking for!', error))
