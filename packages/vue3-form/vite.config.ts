import vue from '@vitejs/plugin-vue';
import build from '@xuelin/vite-plugin-build';

import path from 'path';
import { defineConfig, UserConfig } from 'vite';

export default defineConfig(() => {
  const config: UserConfig = {
    plugins: [vue(), build()],
    resolve: {
      alias: {
        '@xuelin/vue3-form': path.resolve(__dirname, 'src/index.ts'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            'dt-prefix': 'dt',
          },
        },
      },
    },
  };
  return config;
});
