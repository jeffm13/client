'use strict';

const events = require('events');

/**
 * A primitive buffered stream implementation to enable the client to deal
 * with payloads that have been split into multiple chunks and payloads that
 * contain more than one message.
 * @type {BufferedStream}
 */
class BufferedStream extends events.EventEmitter {

  /**
   * Creates a buffered stream wrappend around another stream. Treats each
   * chunk of data between newlines as a 'message'.
   * @param {Stream} stream the stream that this object will buffer (eg., a
   * socket)
   * @fires BufferedStream#message
   * @fires BufferedStream#error
   */
  constructor(stream) {

    super();

    const self = this;
    this.buffer = '';

    /**
     * Fired when a message is encountered in the stream
     * @event BufferedStream#message
     * @type {String}
     */
    stream.on('data', (data) => {

      self.buffer += data;
      let boundary = self.buffer.indexOf('\n');

      while (boundary !== -1) {

        let input = self.buffer.substr(0, boundary);
        self.buffer = self.buffer.substr(boundary + 1);
        self.emit('message', input);
        boundary = self.buffer.indexOf('\n');
      }
    });

    /**
     * Fired when an error is encountered in the underlying stream.
     * @event BufferedStream#error
     * @type {object}
     */
    stream.on('error', (error) => self.emit('error', error));
  }
}

module.exports = BufferedStream;
