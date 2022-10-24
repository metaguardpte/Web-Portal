import { request } from '@umijs/max';
import { v4 } from 'uuid';

interface IResponse<TPayload> {
    error: {
        id?: string;
    };
    payload: TPayload;
}

type ResponseType<T> = IResponse<T>;

export interface IFailableResult {
    readonly fail: boolean;
    readonly errorId?: string;
}

export class Result<T> implements IFailableResult {
    readonly fail: boolean;
    readonly errorId?: string;
    readonly payload?: T;
    constructor(res: ResponseType<T>) {
        this.fail = !!res.error.id;
        this.payload = res.payload;
        this.errorId = res.error.id;
    }
}

export interface ILocalResult<T> {
    fail: boolean;
    errorId?: string;
    payload?: T;
}

function addRequestIdHeader(options?: { [k: string]: any }) {
    let { headers, ...otherOptions } = options ?? { headers: {} };
    headers = { ...headers, ...{ 'X-Request-ID': v4() } };
    return { ...otherOptions, headers };
}

function addContentTypeHeader(options?: { [k: string]: any }) {
    let { headers, ...otherOptions } = options ?? { headers: {} };
    headers = { ...headers, ...{ 'Content-Type': 'application/json' } };
    return { ...otherOptions, headers };
}

export const onceExecutor = () => {
    let preResolve: any;
    return <T = any>(
        requester: () => Promise<T>,
    ): Promise<T & { skip?: boolean }> => {
        if (preResolve) {
            preResolve({ skip: true });
        }
        return new Promise(async (resolve) => {
            preResolve = resolve;
            const res = await requester();
            resolve(res);
        });
    };
};

export const requester = {
    get: async function <T>(
        path: string,
        params?: {},
        options?: { [k: string]: any },
    ) {
        const res = await request<ResponseType<T>>(path, {
            method: 'GET',
            params: params,
            ...addRequestIdHeader(options),
        });
        return new Result<T>(res);
    },

    post: async function <T>(
        path: string,
        payload?: any,
        options?: { [k: string]: any },
    ) {
        const res = await request<ResponseType<T>>(path, {
            method: 'POST',
            data: payload,
            ...addContentTypeHeader(addRequestIdHeader(options)),
        });
        return new Result<T>(res);
    },

    put: async function <T>(
        path: string,
        payload: any,
        options?: { [k: string]: any },
    ) {
        const res = await request<ResponseType<T>>(path, {
            method: 'PUT',
            data: payload,
            ...addContentTypeHeader(addRequestIdHeader(options)),
        });
        return new Result<T>(res);
    },

    patch: async function <T>(
        path: string,
        payload: any,
        options?: { [k: string]: any },
    ) {
        const res = await request<ResponseType<T>>(path, {
            method: 'PATCH',
            data: payload,
            ...addContentTypeHeader(addRequestIdHeader(options)),
        });
        return new Result<T>(res);
    },

    delete: async function <T>(
        path: string,
        payload?: any,
        options?: { [k: string]: any },
    ) {
        const res = await request<ResponseType<T>>(path, {
            method: 'DELETE',
            data: payload,
            ...addContentTypeHeader(addRequestIdHeader(options)),
        });
        return new Result<T>(res);
    },
};
