import { defineConfig } from '@umijs/max';

const { PROXY_URL } = process.env;

export default defineConfig({
    antd: {},
    dva: false,
    qiankun: false,
    valtio: false,
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
            redirect: '/share',
        },
        {
            path: '/share',
            component: 'Share',
            layout: false,
        },
    ],
    npmClient: 'pnpm',
    locale: {
        default: 'en-US',
        baseSeparator: '-',
    },
    presets: ['./plugins/urlPlugin'],
    proxy: {
        '/api': {
            target: PROXY_URL,
            changeOrigin: true,
        },
    },
});
