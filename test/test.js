'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const { realFetch, Request, Response, Headers } = require('node-fetch');
const fetchMock = require('fetch-mock');
const proxyquire = require('proxyquire');
chai.use(chaiAsPromised);

const apis = require('../dist/index');

const {
    curriedRead,
    read,
    update,
    curriedUpdate,
    create,
    curriedCreate,
    CreateMethod,
    del,
    curriedDel,
    head,
    curriedHead,
    http,
    curriedHttp,
} = apis;

beforeEach(() => {
    fetchMock.config.sendAsJson = true;
    fetchMock.config.fallbackToNetwork = true;
    fetchMock.restore();
});

describe('HTTP Request Test Suite', () => {
    it('Should run test setup', () => {
        const result = 'Pass';
        expect(result).to.equal('Pass');
    });
    it('Should run default fetch-mock', () => {
        const myMock = fetchMock.sandbox().mock('/home', 200);
        return expect(myMock('/home')).to.eventually.have.property('status');
    });
    it('Should run HTTP Get and return OK', () => {
        const response = JSON.stringify({ hello: 'world' });
        const myMock = fetchMock.sandbox().mock({ url: '/home', method: 'get' }, response);
        const request = new Request('/home', { method: 'GET' });
        return expect(
            http(myMock, request).then((resp) => {
                //console.log(resp);
                return resp.parsedBody.hello;
            }),
        ).to.eventually.become('world');
    });
    it('Should run Curried HTTP Get and return OK', () => {
        const myMock = fetchMock.sandbox().mock({ url: '/home', method: 'GET' }, 200);
        const request = new Request('/home', { method: 'GET' });
        return expect(
            curriedHttp(myMock)(request).then((resp) => {
                return resp.status;
            }),
        ).to.eventually.become(200);
    });
    it('Should run Head and return no data', () => {
        const myMock = fetchMock.sandbox().mock({ url: '/home', method: 'HEAD' }, 200);
        return expect(head(myMock, '/home')).to.eventually.have.property('status');
    });
    it('Should run curried Head and return no data', () => {
        const myMock = fetchMock.sandbox().mock({ url: '/home', method: 'HEAD' }, 200);
        return expect(curriedHead(myMock)('/home')()).to.eventually.have.property('status');
    });
    it('Should run API default node-fetch', () => {
        return expect(
            head(undefined, 'https://twitter.com/', { 'Content-Type': 'text/html; charset=utf-8' }).then((resp) => {
                return resp.ok;
            }),
        ).to.eventually.become(true);
    });
    it('Should run Read and return parsedBody data', () => {
        const response = JSON.stringify({ hello: 'world' });
        const myMock = fetchMock.sandbox().mock({ url: '/home', method: 'GET' }, response);
        return expect(read(myMock, '/home')).to.eventually.have.property('parsedBody');
    });
    it('Should run curried Read and return OK', () => {
        const myMock = fetchMock.sandbox().mock({ url: '/home', method: 'GET' }, 200);
        return expect(
            curriedRead(myMock)('/home')().then((resp) => {
                return resp.status;
            }),
        ).to.eventually.become(200);
    });
    it('Should run Read Unmatched URL with Error', () => {
        const fakeUserDetails = { name: 'H.G. Wells' };
        fetchMock
            .get('/session', function getSession(url, opts) {
                const jwt = extractToken(opts);
                if (!jwt || jwt !== fakeToken) {
                    return delay({
                        status: 401,
                        body: JSON.stringify({
                            details: 'Unauthorized',
                        }),
                    });
                }
                return delay({
                    status: 200,
                    body: JSON.stringify({
                        success: true,
                        data: fakeUserDetails,
                    }),
                });
            })
            .catch((unmatchedUrl) => {
                // fallover call original fetch, because fetch-mock treats
                // any unmatched call as an error - its target is testing
                return realFetch(unmatchedUrl);
            });
        return expect(read('/home', fetchMock)).to.be.rejected;
    });
    it('Should Return Body with Post', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello',
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: { name: 'John Henry' },
            },
            { status: 201, body: { id: 1 }, headers: { 'content-type': 'application/json' } },
        );
        return expect(
            create(
                myMock,
                CreateMethod.POST,
                '/hello',
                { 'Content-Type': 'application/json' },
                { name: 'John Henry' },
            ).then((resp) => {
                return resp.parsedBody.id;
            }),
        ).to.eventually.become(1);
    });
    it('Should Return no Body with Create and Status 204', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello',
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: { name: 'John Henry' },
            },
            { status: 204, body: { id: 1 } },
        );
        return expect(
            create(
                myMock,
                CreateMethod.POST,
                '/hello',
                { 'Content-Type': 'application/json' },
                { name: 'John Henry' },
            ).then((resp) => {
                return resp.parsedBody === undefined;
            }),
        ).to.eventually.become(true);
    });
    it('Should not Return entity body with Create and No Content-Type', () => {
        let myHeaders = new Headers();
        myHeaders.append('Location', 'http://www.home.com/id');
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello',
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: { name: 'John Henry' },
            },
            { status: 201, headers: myHeaders },
        );
        return expect(
            create(
                myMock,
                CreateMethod.POST,
                '/hello',
                { 'Content-Type': 'application/json' },
                { name: 'John Henry' },
            ).then((resp) => {
                return resp.parsedBody;
            }),
        ).to.eventually.become(undefined);
    });
    it('Should Create with PUT', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name/3',
                method: 'put',
                body: { name: 'John Henry' },
                headers: { 'Content-Type': 'application/json' },
            },
            { status: 201, body: { id: 3 } },
        );
        return expect(
            create(
                myMock,
                CreateMethod.PUT,
                '/hello/name/3',
                { 'Content-Type': 'application/json' },
                { name: 'John Henry' },
            ).then((resp) => {
                return resp.parsedBody.id;
            }),
        ).to.eventually.become(3);
    });
    it('Should PUT with Curried Create and Status 204 ', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name/3',
                method: 'put',
                body: { name: 'John Henry' },
                headers: { 'Content-Type': 'application/json' },
            },
            new Response('No Content', { status: 204 }),
        );
        return expect(
            curriedCreate(myMock)(CreateMethod.PUT)('/hello/name/3')({ 'Content-Type': 'application/json' })({
                name: 'John Henry',
            }).then((resp) => {
                return resp.statusText;
            }),
        ).to.eventually.become('No Content');
    });
    it('Should POST with Curried Create', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name',
                method: 'post',
                body: { name: 'John Henry' },
                headers: { 'Content-Type': 'application/json' },
            },
            {
                body: { id: 1 },
                status: 201,
                headers: { Location: 'apis://home.com/hello/name/1' },
            },
        );
        return expect(
            curriedCreate(myMock)(CreateMethod.POST)('/hello/name')({ 'Content-Type': 'application/json' })({
                name: 'John Henry',
            }).then((resp) => {
                return resp.headers.get('Content-Type');
            }),
        ).to.eventually.become('application/json');
    });
    it('Should Update with 204 Status', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name',
                method: 'put',
                body: { name: 'John Henry' },
                headers: { 'Content-Type': 'application/json' },
            },
            new Response('No Content', { status: 204 }),
        );
        return expect(
            update(myMock, '/hello/name', { 'Content-Type': 'application/json' }, { name: 'John Henry' }).then(
                (resp) => {
                    return resp.statusText;
                },
            ),
        ).to.eventually.become('No Content');
    });
    it('Should run curried Update with JSON entity body', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name',
                method: 'put',
                body: { name: 'John Henry' },
                headers: { 'Content-Type': 'application/json' },
            },
            {
                body: { id: 1 },
                status: 201,
            },
        );
        return expect(
            curriedUpdate(myMock)('/hello/name')({ 'Content-Type': 'application/json' })({ name: 'John Henry' }).then(
                (resp) => {
                    return resp.parsedBody.id;
                },
            ),
        ).to.eventually.become(1);
    });
    it('Should run Delete with parsedBody', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name/1',
                method: 'delete',
            },
            { body: { status: 'completed' }, status: 200 },
        );
        return expect(del(myMock, '/hello/name/1').then((resp) => resp.parsedBody.status)).to.eventually.become(
            'completed',
        );
    });
    it('Should run curried Delete with status 204 without parsedBody', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name/1',
                method: 'delete',
            },
            { status: 204 },
        );
        return expect(
            curriedDel(myMock)('/hello/name/1')().then((resp) => {
                return resp.status === 204 && resp.parsedBody === undefined;
            }),
        ).to.eventually.become(true);
    });
    it('Should run curried Delete with status 202', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name/1',
                method: 'delete',
            },
            { status: 202, body: { result: 'pending', expiration: 1800 } },
        );
        return expect(
            curriedDel(myMock)('/hello/name/1')().then(
                (resp) => resp.parsedBody.result === 'pending' && resp.parsedBody.expiration === 1800,
            ),
        ).to.eventually.become(true);
    });
    after(() => fetchMock.restore());
});
