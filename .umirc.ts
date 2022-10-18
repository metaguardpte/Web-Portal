import { defineConfig } from '@umijs/max';

export default defineConfig({
  history: { type: 'hash' },
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/share/null/null',
    },
    {
      path: '/share/:id/:key',
      component: 'Share',
      layout: false
    }
  ],
  npmClient: 'pnpm',
   locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    default: 'zh-CN',
    baseSeparator: '-',
  },
});

