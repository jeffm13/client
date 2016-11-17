'use strict';

const net = require('net');
const events = require('events');
const BufferedStream = require('./buffered-stream');

/**
 * A simple newline-delimited JSON (ndj) client
 * @type {NDJClient}
 */
class NDJClient extends events.EventEmitter {

  /**
   * Saves the host and port used to create the instance.
   * @constructor
   * @param {Number} port The port number on the server
   * @param {String} host The host address
   */
  constructor(port, host) {
    super();
    this.host = host;
    this.port = port;
  }

  /**
   * Connects to the server
   * @fires NDJClient#connected
   * @fires NDJClient#message
   * @fires NDJClient#error
   */
  connect() {
    const self = this;


    this.client = net.connect(this.port, this.host, () => {
      self.lastInbound = '';

      /**
       * Fired when the client is connected to the server
       * @event NDJClient#connected
       * @type {object}
       * @property {String} host The server host address
       * @property {Number} port The server port number
       */
      self.emit('connected', {
        host: self.host,
        port: self.port
      });
      self.stream = new BufferedStream(self.client);

      /**
       * Processes inbound responses.  Parses messages into JSON format,
       * and verifies that they are correlated with requests made by this
       * client. Non-correlated messages are discarded.
       */
      self.stream.on('message', (data) => {

        var message;

        self.lastInbound = data;
        try {
          message = JSON.parse(data);
          if (message.type === 'msg') {
            let verified = self.correlator.verifyResponse(message)
            if (!verified) {
              return;
            }
          }

          /**
           * Message received from the server. Message has been
           * parsed from the JSON received from the server and, if a 'msg'
           * type, had its correlation id verified.
           * @event NDJClient#message
           * @type {object}
           */
          self.emit('message', message);
        } catch (error) {
          error.type = 'error';
          error.cause = 'parse';

          /**
           * Error encountered when parsing raw JSON message from the server
           * @event NDJClient#error
           * @type {object}
           */
          self.emit('error', error);
        }
      });
    });
  }

  /**
   * Disconnect the client from the server (per requirements) when timeouts
   * are received.
   */
  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  /**
   * Writes a message to the server.
   */
  write(message) {
    this.client.write(message);
  }

  /**
   * Returns the last inbound (unparsed) message
   */
  getLastInbound() {
    return this.lastInbound;
  }

  /**
   * Sets the correlator that verifies correlated responses
   */
  setCorrelator(correlator) {
    this.correlator = correlator;
  }
}

module.exports = NDJClient;
