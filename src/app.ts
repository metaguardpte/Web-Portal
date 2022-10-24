import { RequestConfig } from '@umijs/max';

export async function getInitialState(): Promise<{ name: string }> {
    return { name: '@umijs/max' };
}

export const layout = () => {
    return {
        logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
        menu: {
            locale: false,
        },
    };
};

const getBaseUrl = () => {
    const urlParams = window.location.search.replace('?', '').split('&');
    let env = '';
    urlParams.forEach((p) => {
        if (p) {
            const s = p.split('=');
            if (s[0] === 'env') {
                env = s[1];
            }
        }
    });
    if (env === 'dev') {
        return 'https://l8ee0j8yb8.execute-api.ap-southeast-1.amazonaws.com/Prod';
    } else if (env === 'test') {
        return 'https://ro8d3r7nxb.execute-api.ap-southeast-1.amazonaws.com/Prod';
    } else if (env === 'pre') {
        return 'https://ro8d3r7nxb.execute-api.ap-southeast-1.amazonaws.com/Prod';
    }
    return 'https://zv42of7gd4.execute-api.ap-southeast-1.amazonaws.com';
};

export const request: RequestConfig = {
    baseURL: getBaseUrl(),
    timeout: 1000,
    errorConfig: {
        errorHandler() {},
        errorThrower() {},
    },
    requestInterceptors: [],
    responseInterceptors: [],
};
