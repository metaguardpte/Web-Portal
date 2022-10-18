import { defineConfig } from '@umijs/max';

const { PROXY_URL } = process.env;

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
  plugins: ['./plugins/urlPlugin'],
  proxy: {
  '/api': {
    'target': PROXY_URL,
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  }
}
});

