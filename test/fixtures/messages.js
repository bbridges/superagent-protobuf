'use strict';

const path = require('path');

const protobuf = require('protobufjs');

const root = protobuf.loadSync(path.join(__dirname, 'messages.proto'));

module.exports.Test1 = root.lookupType('Test1');
module.exports.Test2 = root.lookupType('Test2');
