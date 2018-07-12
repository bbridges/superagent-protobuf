'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const { protobufParser, protobufSender } = require('koa-protobuf');

const { Test1, Test2 } = require('./messages');

let app = new Koa();
let router = new Router();

app.use(protobufSender());

router.get('/one', (ctx) => {
  expect(ctx.request.accepts('application/x-protobuf'))
    .toEqual('application/x-protobuf');

  ctx.proto = Test1.create({
    field_1: 5,
    field_2: Buffer.from([1, 2, 3, 4])
  });
});

router.post('/two', protobufParser(Test1), (ctx) => {
  expect(ctx.request.accepts('text/plain'))
    .toBe('text/plain');

  expect(ctx.request.proto).toEqual(Test1.create({
    field_1: 6,
    field_2: Buffer.from([4, 3, 2, 1])
  }));

  ctx.body = 'success!';
});

router.put('/three', protobufParser(Test1), (ctx) => {
  expect(ctx.request.accepts('application/x-protobuf'))
    .toBe('application/x-protobuf');

  ctx.proto = Test2.create({
    field_1: ctx.request.proto.field_1,
    field_2: true
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
