import { defineConfig } from 'dumi';
import fs from 'fs';
import path from 'path';
const resolve = (p: string) => path.resolve(__dirname, p);
const list = fs.readdirSync(resolve('packages'));
const listDir = list.map((str) => `packages/${str}/src`);
const alias = list.reduce((obj, key, index) => {
  return {
    ...obj,
    [`@wxl/${key}`]: resolve(listDir[index]),
  };
}, {});

export default defineConfig({
  outputPath: 'docs-dist',
  plugins: [path.resolve(__dirname, './.dumi/modifyRoutes.ts')],
  resolve: {
    forceKebabCaseRouting: false,
    atomDirs: [{ type: 'components', dir: '/packages' }],
  },
  favicons: ['/favicon.png'],
  history: {
    type: 'hash',
  },
  monorepoRedirect: {},
  extraBabelPlugins: [['import', { libraryName: 'wxl', style: true }]],
  themeConfig: {
    footer: false,
    logo: '/logo.png',
    nav: [
      { title: '组件', link: '/components/aes-des-secret' },
      { title: '笔记', link: '/note/react18' },
      { title: '部署', link: '/deploy/web' },
      { title: '源码', link: '/source/call' },
    ],
    sidebar: {
      '/components': [
        {
          children: list.map((item) => ({
            title: `@wxl/${item}`,
            link: `/components/${item}`,
          })),
        },
      ],
    },
    alias,
    // socialLinks: {
    //   github: 'https://github.com/WangXueLinA?tab=repositories',
    // },
  },
  lessLoader: {
    javascriptEnabled: true,
    modifyVars: {
      'dt-prefix': 'dt',
    },
  },
});
