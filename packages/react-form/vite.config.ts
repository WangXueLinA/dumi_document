import react from '@vitejs/plugin-react';
import build from '@xuelin/vite-plugin-build';

import path from 'path';
import { defineConfig, UserConfig } from 'vite';

export default defineConfig(() => {
  const config: UserConfig = {
    plugins: [react(), build()],
    resolve: {
      alias: {
        '@xuelin/react-form': path.resolve(__dirname, 'src/index.tsx'),
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
