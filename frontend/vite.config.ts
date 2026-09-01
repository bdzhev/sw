import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type Plugin, type PluginOption } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

/**
 * The only packages on every route's critical path. Their transitive deps come
 * along via `advancedChunks.includeDependenciesRecursively` (rolldown default),
 * so `@vue/*`, `query-core` and `vue-demi` need no arm of their own.
 *
 * Each alternative is anchored with a trailing `[\\/]` so `vue` cannot match
 * `vue-i18n`, `vue-demi` or `@tanstack/vue-table`.
 */
const FRAMEWORK_RE =
  /node_modules[\\/](?:vue|vue-router|pinia|@tanstack[\\/]vue-query)[\\/]/;

const skipConfigJsInDev = (): Plugin => {
  return {
    name: 'skip-config-js-in-dev',
    transformIndexHtml: {
      order: 'pre',
      handler: (html: string, ctx: { server?: unknown }) => {
        if (!ctx.server) {
          return html;
        }

        return html.replace(/<script src="\/config\.js"><\/script>\s*/g, '');
      },
    },
  };
};

/** Treemap of the real chunk graph. Run `bun run analyze`. */
const analyzePlugins = (): PluginOption[] => {
  if (process.env.ANALYZE !== '1') {
    return [];
  }

  return [
    visualizer({
      filename: 'stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
    }) as PluginOption,
  ];
};

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    skipConfigJsInDev(),
    vue(),
    vueDevTools(),
    tailwindcss(),
    ...analyzePlugins(),
  ],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // One group on purpose. A `node_modules` catch-all forces every dep
        // onto the critical path; naming a group for gsap/zod does the same,
        // since Vite preloads shared group chunks from index.html. Everything
        // unlisted falls through to rolldown's per-reachability splitting,
        // which also splits finer than a package-name group can.
        advancedChunks: {
          groups: [{ name: 'framework', test: FRAMEWORK_RE, priority: 30 }],
        },
      },
    },
  },
});
