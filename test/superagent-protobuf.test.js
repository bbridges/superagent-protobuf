'use strict';

const request = require('superagent');
const reqTest = require('supertest');

const addProtobuf = require('..');
const app = require('./fixtures/app');
const { Test1, Test2 } = require('./fixtures/messages');

addProtobuf(request);
addProtobuf(reqTest);

let server;
let base;

beforeEach((done) => {
  server = app.listen((err) => {
    if (err) {
      done(err);
    } else {
      base = `http://localhost:${server.address().port}`;
      done();
    }
  });
});

test('decode a protobuf', async () => {
  let res = await request.get(base + '/one').proto(Test1);

  expect(res.status).toEqual(200);
  expect(res.type).toEqual('application/x-protobuf');
  expect(res.body).toEqual(Test1.create({
    field_1: 5,
    field_2: Buffer.from([1, 2, 3, 4])
  }));
});

test('encode a protobuf', async () => {
  let toSend = Test1.create({
    field_1: 6,
    field_2: Buffer.from([4, 3, 2, 1])
  });

  let res = await request.post(base + '/two').sendProto(toSend);

  expect(res.status).toEqual(200);
  expect(res.type).toEqual('text/plain');
  expect(res.text).toEqual('success!');
});

test('encode and decode a protobuf', async () => {
  let toSend = Test1.create({
    field_1: 777,
    field_2: Buffer.from([4, 3, 2, 1])
  });

  let res = await request.put(base + '/three').sendProto(toSend).proto(Test2);

  expect(res.status).toEqual(200);
  expect(res.type).toEqual('application/x-protobuf');
  expect(res.body).toEqual(Test2.create({
    field_1: 777,
    field_2: true
  }));
});

test('decode a protobuf with supertest', async () => {
  let res = await reqTest(server).get('/one').proto(Test1);

  expect(res.status).toEqual(200);
  expect(res.type).toEqual('application/x-protobuf');
  expect(res.body).toEqual(Test1.create({
    field_1: 5,
    field_2: Buffer.from([1, 2, 3, 4])
  }));
});

test('encode a protobuf with supertest', async () => {
  let toSend = Test1.create({
    field_1: 6,
    field_2: Buffer.from([4, 3, 2, 1])
  });

  let res = await reqTest(server).post('/two').sendProto(toSend);

  expect(res.status).toEqual(200);
  expect(res.type).toEqual('text/plain');
  expect(res.text).toEqual('success!');
});

test('encode and decode a protobuf with supertest', async () => {
  let toSend = Test1.create({
    field_1: 777,
    field_2: Buffer.from([4, 3, 2, 1])
  });

  let res = await reqTest(server).put('/three').sendProto(toSend).proto(Test2);

  expect(res.status).toEqual(200);
  expect(res.type).toEqual('application/x-protobuf');
  expect(res.body).toEqual(Test2.create({
    field_1: 777,
    field_2: true
  }));
});

afterEach((done) => {
  server.close(() => done());
});
