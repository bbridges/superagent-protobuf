'use strict';

/** Install the methods on the superagent or supertest object. */
module.exports = function install(superagent) {
  let Request;

  if (superagent.Request !== undefined) {
    Request = superagent.Request;
  } else if (superagent.Test !== undefined) {
    Request = superagent.Test;
  } else {
    throw Error('unsupport superagent object type');
  }

  /** Decode a protobuf message when the request completes. */
  Request.prototype.proto = function (type) {
    return this
      .buffer(true)
      .set('Accept', 'application/x-protobuf')
      .parse(_handleIncomingProto(type));
  };

  // Make a callback for when a protobuf message has been received.
  function _handleIncomingProto(type) {
    return function (res, cb) {
      if (res.headers['content-type'] == 'application/x-protobuf') {
        let chunks = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          let buffer = Buffer.concat(chunks);

          try {
            // Set the body to the decoded proto if it's valid.
            let proto = type.decode(buffer);
            cb(null, proto);
          } catch (err) {
            // An error while decoding the buffer happened.
            cb(err);
          }
        });
      } else {
        // There's nothing to encode since a protobuf wasn't received
        // according to the content type.
        cb(null, {});
      }
    };
  }

  /** Encode a protobuf message to send over a request. */
  Request.prototype.sendProto = function (message) {
    return this
      .set('Content-Type', 'application/x-protobuf')
      .send(message.constructor.encode(message).finish());
  };

  return superagent;
};
