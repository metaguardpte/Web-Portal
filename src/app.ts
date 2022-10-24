import { RequestConfig } from '@umijs/max';
import { baseUrl } from '@/.hub/config';
import { history } from '@umijs/max';

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
    return baseUrl;
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
