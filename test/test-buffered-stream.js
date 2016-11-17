var expect = require('chai')
  .expect;
var streamify = require('stream-array');
var BufferedStream = require('../buffered-stream');

var messages = [
  'First message\n',
]

describe("buffered stream tests", () => {
  describe("emits messages", () => {
    it(
      "emits a message when a string is received with a trailing newline",
      () => {
        var message = ['first message\n'];
        var readable = streamify(message);
        var buffStream = new BufferedStream(readable);
        buffStream.on('message', (message) => {
          expect(message)
            .to.equal('first message');
        });
      });

    it(
      "emits a message when a string is received with no trailing newline",
      () => {
        var message = ['first message'];
        var readable = streamify(message);
        var buffStream = new BufferedStream(readable);
        buffStream.on('message', (message) => {
          expect(message)
            .to.equal('first message');
        });
      })


  })

  describe("splits messages containing newlines", () => {
    var counter = 0;
    it(
      "emits two messages when the stream sends data containing a newline, with a trailing newline",
      () => {
        var message = ['first message\nsecond message\n'];
        var readable = streamify(message);
        var buffStream = new BufferedStream(readable);
        buffStream.on('message', (message) => {
          switch (counter) {
          case 0:
            expect(message)
              .to.equal('first message');
            counter++;
            break;
          case 1:
            expect(message)
              .to.equal('second message');
            counter++;
            break;
          }
        });
      });
    after(() => {
      expect(counter)
        .to.equal(2)
    })
  })

  describe("combines messages not containing newlines", () => {
    var counter = 0;
    it(
      "combines two messages into one when the first contains no newline",
      () => {
        var message = ['first message', ' second message\n'];
        var readable = streamify(message);
        var buffStream = new BufferedStream(readable);
        buffStream.on('message', (message) => {
          expect(message)
            .to.equal('first message second message');
          counter++;
        });
      });
    after(() => {
      expect(counter)
        .to.equal(1)
    })
  })
})
