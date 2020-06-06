import { read, curriedRead, curriedHttp, HttpRequest, HttpResponse } from './lib/index';
import { curry, compose } from 'ramda';
import fetch, { Request, RequestInit, HeadersInit } from 'node-fetch';

const { log } = console;

// response JSON type
interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

function testGet(api: HttpRequest, path: string): Promise<HttpResponse<Todo[]>> {
    return read<Todo[]>(api, path);
}
/**
 * Get JSON data from api and casts it before returning
 *
 * @param {Promise<HttpResponse<Todo[]>>} body
 * @returns {Todo[]}
 */
function parseBody(body: Promise<HttpResponse<Todo[]>>): Promise<Todo[]> {
    return body.then((resp: HttpResponse<Todo[]>) => {
        const todos = resp.parsedBody as Todo[];
        return todos;
    });
}
type todoFilter = (todo: Todo) => boolean;

function pageTodos(start: number, size: number, results: Promise<Todo[]>): Promise<Todo[]> {
    return results.then((resp: Todo[]) => {
        return resp.slice(start, size);
    });
}
const start = Date.now();
function logTodos(todos: Promise<Todo[]>): void {
    try {
        todos.then((resp: Todo[]) => {
            const finish = Date.now();
            const delay = finish - start;
            log(`Filtered these todos with delay ${delay} ms`);
            for (const value of resp) {
                log(value);
            }
        });
    } catch (e) {
        log('Error', e);
    }
}
function filterTodos(filter: todoFilter, todos: Promise<Todo[]>): Promise<Todo[]> {
    return todos.then((resp: Todo[]) => resp.filter(filter));
}
const curryGet = curry(testGet);
const curryPage = curry(pageTodos);
const curryFilter = curry(filterTodos);

const dataComposed1 = compose(
    logTodos,
    curryFilter((todo) => todo.completed),
    curryPage(0)(4),
    parseBody,
    curryGet(fetch),
);

dataComposed1('https://jsonplaceholder.typicode.com/todos');

const currRead = curriedRead<Todo[]>(fetch)('https://jsonplaceholder.typicode.com/todos');

const dataComposed2 = compose(
    logTodos,
    curryFilter((todo) => todo.completed),
    curryPage(0)(4),
    parseBody,
);
dataComposed2(currRead());
curriedRead<Todo[]>(fetch)('https://jsonplaceholder.typicode.com/todos')().then((resp) => {
    log('curriedRead Done with status', resp.status);
});

const headers: HeadersInit = {
    'Content-Type': 'text/html; charset=utf-8',
};
const args: RequestInit = { method: 'head', headers: headers };
const req: Request = new Request('https://twitter.com/', args);

curriedHttp<Todo[]>(fetch)(req).then((resp) => {
    const finish = Date.now();
    const delay = finish - start;
    log(`curriedHttp Done with status ${resp.status} with delay ${delay} ms`);
});
