import { readFileSync } from 'node:fs';

/**
 * Host half of the Trade Desk plugin: serve the existing self-contained
 * workbench as a same-origin page that the Client panel embeds.
 */
export const inject = ['webServer'];

const ROUTE = '/plugins/demian-trade-suite/workbench.html';

export function apply(ctx) {
  const html = readFileSync(new URL('./assets/workbench.html', import.meta.url));

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: ROUTE,
    handler(req, res) {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 405;
        res.setHeader('Allow', 'GET, HEAD');
        res.end('Method Not Allowed');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      res.end(html);
    },
  }), 'demian-trade-suite:workbench-route');
}
