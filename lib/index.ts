import fetch, { Request, RequestInfo, HeadersInit, RequestInit, Response } from 'node-fetch';

/**
 * Configurable Generic Async HTTP Request using fetch. Returns partial Response containing only a JSON body
 * @export
 * @template T
 * @param {RequestInfo} request
 * @param {HttpRequest} [api=fetch]
 * @returns {Promise<T>}
 */
export async function httpBody<T>(request: RequestInfo, api: HttpRequest = fetch): Promise<T> {
    const response = await api(request);
    const body = await response.json();
    return body;
}

/**
 * Configurable Generic Async HTTP Request API using fetch. Response containing headers and body if applicable.
 * Entity body is conditional on presence of proper response status code and content-type header.
 * @template T
 * @param {HttpRequest} api
 * @param {RequestInfo} request
 * @returns {Promise<HttpResponse<T>>}
 */
async function httpFull<T>(request: RequestInfo, api: HttpRequest = fetch): Promise<HttpResponse<T>> {
    const resp: HttpResponse<T> = await api(request);
    if (resp.ok) {
        try {
            const contentType = resp.headers.get('content-type') as string;
            if (resp.status !== 204 && contentType) resp.parsedBody = await resp.json();
        } catch (error) {
            throw error;
        }
        return resp;
    }
    throw new Error(resp.statusText);
}

/**
 * Configurable Async HTTP request using Get method. Default set for api and headers
 *
 * @export
 * @template T
 * @param {HttpRequest} [api=fetch]
 * @param {string} path
 * @param {HeadersInit} [headers={
 *         'Content-Type': 'application/json',
 *     }]
 * @returns {Promise<HttpResponse<T>>}
 */
export async function read<T>(
    api: HttpRequest = fetch,
    path: string,
    headers: HeadersInit = {
        'Content-Type': 'application/json',
    },
): Promise<HttpResponse<T>> {
    const args: RequestInit = { method: 'get', headers: headers };
    return await httpFull<T>(new Request(path, args), api);
}

/**
 * Curried Read is Configurable Async HTTP request using Get method. Default set for api and headers
 * @export
 * @template T
 * @param {HttpRequest} [api=fetch]
 * @returns {function} Curries Async read. (path:string) => (headers:HeadersInit) => Promise<HttpResponse<T>>
 */
export function curriedRead<T>(api: HttpRequest = fetch) {
    return (path: string) => (
        headers: HeadersInit = {
            'Content-Type': 'application/json',
        },
    ): Promise<HttpResponse<T>> => {
        const args: RequestInit = { method: 'get', headers: headers };
        return httpFull<T>(new Request(path, args), api);
    };
}

/**
 * Configurable HTTP Put with injectable Request API. Default set for api and headers.
 * @export
 * @template T
 * @param {HttpRequest} [api=fetch]
 * @param {string} path
 * @param {HeadersInit} [headers={
 *         'Content-Type': 'application/json',
 *     }]
 * @param {(object | string | number)} body
 * @returns {Promise<HttpResponse<T>>}
 */
export async function update<T>(
    api: HttpRequest = fetch,
    path: string,
    headers: HeadersInit = {
        'Content-Type': 'application/json',
    },
    body: object | string | number,
): Promise<HttpResponse<T>> {
    const args: RequestInit = { method: 'put', headers: headers, body: JSON.stringify(body) };
    return await httpFull<T>(new Request(path, args), api);
}

/**
 * Curried Update is configurable Async HTTP request using Update method. Default set for api and headers
 * @export
 * @template T
 * @param {HttpRequest} [api=fetch]
 * @returns {function} Curries Async update. 
   (path:string) => (headers:HeadersInit) => (body: object | string| number) => Promise<HttpResponse<T>>
 */
export function curriedUpdate<T>(api: HttpRequest = fetch) {
    return (path: string) => (
        headers: HeadersInit = {
            'Content-Type': 'application/json',
        },
    ) => (body: object | string | number): Promise<HttpResponse<T>> => {
        const args: RequestInit = { method: 'put', headers: headers, body: JSON.stringify(body) };
        return httpFull<T>(new Request(path, args), api);
    };
}

/**
 * Enumeration for the Create HTTP method
 * @export
 * @enum {number}
 */
export enum CreateMethod {
    PUT = 'put',
    POST = 'post',
}
/**
 *  Configurable HTTP Create with Put and Post methods with injectable Request API. Default set for api and headers.
 * @export
 * @template T
 * @param {HttpRequest} [api=fetch]
 * @param {CreateMethod} method
 * @param {string} path
 * @param {HeadersInit} [headers={
 *         'Content-Type': 'application/json',
 *     }]
 * @param {(object | string | number)} body
 * @returns {Promise<HttpResponse<T>>}
 */
export async function create<T>(
    api: HttpRequest = fetch,
    method: CreateMethod,
    path: string,
    headers: HeadersInit = {
        'Content-Type': 'application/json',
    },
    body: object | string | number,
): Promise<HttpResponse<T>> {
    const args: RequestInit = { method: method, headers: headers, body: JSON.stringify(body) };
    return await httpFull<T>(new Request(path, args), api);
}

export function curriedCreate<T>(api: HttpRequest = fetch) {
    return (method: CreateMethod) => (path: string) => (
        headers: HeadersInit = {
            'Content-Type': 'application/json',
        },
    ) => (body: object | string | number): Promise<HttpResponse<T>> => {
        const args: RequestInit = { method: method, headers: headers, body: JSON.stringify(body) };
        return httpFull<T>(new Request(path, args), api);
    };
}
/**
 * Configurable HTTP Delete method with injectable Request API. Defaults set for api and args
 * @export
 * @template T
 * @param {HttpRequest} [api=fetch]
 * @param {string} path
 * @param {RequestInit} [args={ method: 'delete' }]
 * @returns {Promise<HttpResponse<T>>}
 */
export async function del<T>(
    api: HttpRequest = fetch,
    path: string,
    args: RequestInit = { method: 'delete' },
): Promise<HttpResponse<T>> {
    return await httpFull<T>(new Request(path, args), api);
}

/**
 * Curried Configurable Async HTTP Delete method. Defaults set for api and args.
 * @export
 * @template T
 * @param {HttpRequest} [api=fetch]
 * @returns {function} Curries Async delete. (path:string) => (args:RequestInit) => Promise<HttpResponse<T>>
 */
export function curriedDel<T>(api: HttpRequest = fetch) {
    return (path: string) => (args: RequestInit = { method: 'delete' }): Promise<HttpResponse<T>> => {
        return httpFull<T>(new Request(path, args), api);
    };
}

export type HttpRequest = (url: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface HttpResponse<T> extends Response {
    parsedBody?: T;
}
