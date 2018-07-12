# superagent-protobuf

> Adds [protobuf.js](https://github.com/dcodeIO/protobuf.js) encoding and
> decoding support to [superagent](http://visionmedia.github.io/superagent/)

[![Build Status](https://travis-ci.com/bloof-bb/superagent-protobuf.svg?branch=master)](https://travis-ci.com/bloof-bb/superagent-protobuf)
[![Test Coverage](https://coveralls.io/repos/github/bloof-bb/superagent-protobuf/badge.svg?branch=master)](https://coveralls.io/github/bloof-bb/superagent-protobuf?branch=master)
[![NPM Version](https://img.shields.io/npm/v/superagent-protobuf.svg)](https://www.npmjs.com/package/superagent-protobuf)

*Supports both superagent and supertest on Node.js.*

## Installation

Install using `npm`:

```
$ npm install superagent-protobuf
```

## Usage

`superagent-protobuf` adds the `proto(...)` and `sendProto(...)` methods onto
an existing superagent or supertest object.

### Installing

```js
// Using require(...).
const request = require('superagent');
require('superagent-protobuf')(request);

// Using ES6 imports.
import request from 'superagent';
import addProtobuf from 'superagent-protobuf';

addProtobuf(request);
```

The same methods above work with supertest as well:

```js
const request = require('supertest');
require('superagent-protobuf')(request);
```

### `request.proto(...)`

Decodes a protobuf message with a specified message type.

Note that this method sets the `Accept` header to `application/x-protobuf`.

Example usage:

```js
// Send a request and expect a MessageType protobuf.js message back.
let res = await request.get('.../some-endpoint')
  .proto(MessageType);

// The resulting message is stored in the body property.
console.log(res.body);
```

### `request.sendProto(...)`

Encodes a protobuf message with the `Content-Type` `application/x-protobuf`.

Example usage:

```js
let res = await request.post('.../some-endpoint')
  .sendProto(MessageType.create({
    my_field: 1  
  }));
```

This can also be combined with `request.proto(...)` to receive a protobuf
message as well:

```js
let outbound = MessageType.create({
  my_field: 1  
});

// Sending a MessageType message and receiving an AnotherMessageType
// message.
let res = await request.post('.../some-endpoint')
  .sendProto(outbound)
  .proto(AnotherMessageType);

let inbound = res.body;

// Printing out the message.
console.log(inbound);
```

## License

Released under the MIT License (see `LICENSE`).
