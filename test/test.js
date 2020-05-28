'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
// const fetchMock = require('fetch-mock');
const realFetch = require('node-fetch');
const fetchMock = require('fetch-mock');
const proxyquire = require('proxyquire');
chai.use(chaiAsPromised);

const http = require('../dist/index');
// proxyquire('../dist/index', { 'node-fetch': fetchMock });

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
    httpBody,
} = http;

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

    it('Should run HTTP Body Get and return OK', () => {
        const response = JSON.stringify({ hello: 'world' });
        const myMock = fetchMock.sandbox().mock({ url: '/home' }, response);
        return expect(httpBody('/home', myMock)).to.eventually.have.property('hello');
    });
    it('Should run default GET node-fetch', () => {
        return expect(read(undefined, 'https://jsonplaceholder.typicode.com/todos')).to.eventually.have.property(
            'parsedBody',
        );
    });
    it('Should run Read and return data', () => {
        const myMock = fetchMock.sandbox().mock({ url: '/home' }, { parsedBody: { hello: 'world' } });
        return expect(read(myMock, '/home')).to.eventually.have.property('parsedBody');
    });
    it('Should run curried Read and return data', () => {
        const myMock = fetchMock.sandbox().mock({ url: '/home' }, { parsedBody: { hello: 'world' } });
        return expect(curriedRead(myMock)('/home')()).to.eventually.have.property('parsedBody');
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
    it('Should Create with Post', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello',
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: { name: 'John Henry' },
            },
            { body: { name: 'John Henry' }, status: 200, headers: { 'Content-Type': 'application/json' } },
            {},
        );
        return expect(
            create(myMock, CreateMethod.POST, '/hello', { 'Content-Type': 'application/json' }, { name: 'John Henry' }),
        ).to.eventually.have.property('status');
    });
    it('Should Create with PUT', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name/3',
                method: 'put',
                body: { name: 'John Henry' },
                headers: { 'Content-Type': 'application/json' },
            },
            {
                body: { id: 3 },
                status: 201,
                headers: { 'Content-Type': 'application/json', Location: 'http://home.com/hello/name/3' },
            },
            {},
        );
        return expect(
            create(
                myMock,
                CreateMethod.PUT,
                '/hello/name/3',
                { 'Content-Type': 'application/json' },
                { name: 'John Henry' },
            ),
        ).to.eventually.have.property('parsedBody');
    });
    it('Should PUT with Curried Create', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name/3',
                method: 'put',
                body: { name: 'John Henry' },
                headers: { 'Content-Type': 'application/json' },
            },
            {
                body: { id: 3 },
                status: 201,
                headers: { 'Content-Type': 'application/json', Location: 'http://home.com/hello/name/3' },
            },
            {},
        );
        return expect(
            curriedCreate(myMock)(CreateMethod.PUT)('/hello/name/3')({ 'Content-Type': 'application/json' })({
                name: 'John Henry',
            }),
        ).to.eventually.have.property('parsedBody');
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
                headers: { 'Content-Type': 'application/json', Location: 'http://home.com/hello/name/1' },
            },
            {},
        );
        return expect(
            curriedCreate(myMock)(CreateMethod.POST)('/hello/name')({ 'Content-Type': 'application/json' })({
                name: 'John Henry',
            }),
        ).to.eventually.have.property('parsedBody');
    });
    it('Should Update with Status', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name',
                method: 'put',
                body: { name: 'John Henry' },
                headers: { 'Content-Type': 'application/json' },
            },
            { status: 204 },
            {},
        );
        return expect(
            update(myMock, '/hello/name', { 'Content-Type': 'application/json' }, { name: 'John Henry' }),
        ).to.eventually.have.property('status');
    });
    it('Should run curried Update with Status', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name',
                method: 'put',
                body: { name: 'John Henry' },
                headers: { 'Content-Type': 'application/json' },
            },
            { status: 204 },
            {},
        );
        return expect(
            curriedUpdate(myMock)('/hello/name')({ 'Content-Type': 'application/json' })({ name: 'John Henry' }),
        ).to.eventually.have.property('status');
    });
    it('Should run Delete', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name/1',
                method: 'delete',
            },
            { body: { status: 'completed' }, status: 200, headers: { 'Content-Type': 'application/json' } },
            {},
        );
        return expect(del(myMock, '/hello/name/1')).to.eventually.have.property('parsedBody');
    });
    it('Should run curried Delete', () => {
        const myMock = fetchMock.sandbox().mock(
            {
                url: '/hello/name/1',
                method: 'delete',
            },
            { status: 204 },
            {},
        );
        return expect(curriedDel(myMock)('/hello/name/1')()).to.eventually.have.property('status');
    });
    after(() => fetchMock.restore());
});
