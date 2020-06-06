import fetch, { Request, RequestInfo, HeadersInit, RequestInit, Response } from 'node-fetch';

/**
 * Configurable Generic Async HTTP Request API using fetch. Response containing headers and body if
 * applicable. Response entity body is conditional on presence of proper response status code and
 * content-type header.
 * @template T
 * @param {HttpRequest} api
 * @param {Request} request
 * @returns {Promise<HttpResponse<T>>}
 */
export async function http<T>(api: HttpRequest = fetch, request: Request): Promise<HttpResponse<T>> {
    const resp: HttpResponse<T> = await api(request);
    if (resp.ok) {
        if (request.method.toLowerCase() !== 'head') {
            try {
                const contentType = resp.headers.get('content-type') as string;
                if (resp.status !== 204 && contentType) resp.parsedBody = await resp.json();
            } catch (error) {
                throw error;
            }
        }
        return resp;
    }
    throw new Error(resp.statusText);
}
/**
 * Curried HTTP is generic configurable Async HTTP request. Default set for fetch api. Response entity
 * body is conditional on presence of proper response status code and content-type header.
 * @export
 * @template T
 * @param {HttpRequest} api
 * @returns {function} Curries async HTTP request.
 * (request:Request) => (api:HttpRequest) => Promise<HttpResponse<T>>
 */
export function curriedHttp<T>(api: HttpRequest = fetch) {
    return (request: Request): Promise<HttpResponse<T>> => {
        return http<T>(api, request);
    };
}

/**
 * Configurable Async HTTP request using Get method. Default set for api and headers. Response entity body is
 * conditional on presence of proper response status code and content-type header.
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
    return await http<T>(api, new Request(path, args));
}

/**
 * Curried Read is Configurable Async HTTP request using Get method. Default set for api and headers.
 * A response entity body is conditional on presence of proper response status code and content-type header.
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
        return http<T>(api, new Request(path, args));
    };
}

/**
 * Configurable Async HTTP request using HEAD method. Default set for api and headers.
 * @export
 * @template T
 * @param {HttpRequest} [api=fetch]
 * @param {string} path
 * @param {HeadersInit} [headers={
 *         'Content-Type': 'application/json',
 *     }]
 * @returns {Promise<HttpResponse<T>>}
 */
export async function head<T>(
    api: HttpRequest = fetch,
    path: string,
    headers: HeadersInit = {
        'Content-Type': 'application/json',
    },
): Promise<HttpResponse<T>> {
    const args: RequestInit = { method: 'head', headers: headers };
    return await http<T>(api, new Request(path, args));
}

export function curriedHead<T>(api: HttpRequest = fetch) {
    return (path: string) => (
        headers: HeadersInit = {
            'Content-Type': 'application/json',
        },
    ): Promise<HttpResponse<T>> => {
        const args: RequestInit = { method: 'head', headers: headers };
        return http<T>(api, new Request(path, args));
    };
}
/**
 * Configurable HTTP request using Put with injectable Request API. Default set for api and headers.
 * A response Entity body is conditional on presence of proper response status code and content-type
 * header.
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
    return await http<T>(api, new Request(path, args));
}

/**
 * Curried Update is configurable Async HTTP request using Update method. Default set for api and headers
 * @export
 * @template T
 * @param {HttpRequest} [api=fetch]
 * @returns {function} Curries Async update.
 *  (path:string) => (headers:HeadersInit) => (body: object | string| number) => Promise<HttpResponse<T>>
 */
export function curriedUpdate<T>(api: HttpRequest = fetch) {
    return (path: string) => (
        headers: HeadersInit = {
            'Content-Type': 'application/json',
        },
    ) => (body: object | string | number): Promise<HttpResponse<T>> => {
        const args: RequestInit = { method: 'put', headers: headers, body: JSON.stringify(body) };
        return http<T>(api, new Request(path, args));
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
 * Configurable HTTP Create with Put and Post methods with injectable Request API. Default set for api and headers.
 * Entity body is conditional on presence of proper response status code and content-type
 * header.
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
    return await http<T>(api, new Request(path, args));
}

/**
 * Curried configurable HTTP Create with Put and Post methods with injectable Request API. Default set
 * for api and headers. Entity body is conditional on presence of proper response status code and
 * content-type header.
 * @export
 * @template T
 * @param {HttpRequest} [api=fetch]
 * i=fetch]
 * @returns {function} Curries async create.  (method:CreateMethod) =>
 *  (path:string) => (headers:HeadersInit) => (body: object | string| number) => Promise<HttpResponse<T>>
 */
export function curriedCreate<T>(api: HttpRequest = fetch) {
    return (method: CreateMethod) => (path: string) => (
        headers: HeadersInit = {
            'Content-Type': 'application/json',
        },
    ) => (body: object | string | number): Promise<HttpResponse<T>> => {
        const args: RequestInit = { method: method, headers: headers, body: JSON.stringify(body) };
        return http<T>(api, new Request(path, args));
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
    return await http<T>(api, new Request(path, args));
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
        return http<T>(api, new Request(path, args));
    };
}

export type HttpRequest = (url: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface HttpResponse<T> extends Response {
    parsedBody?: T;
}
