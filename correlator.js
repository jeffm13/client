'use strict';

/**
 * Correlates responses with requests. Non-correlated messages are ignored.
 * @type {Correlator}
 */
class Correlator extends Object {

  constructor(name) {

    super();
    this.name = name;
    this.messages = new Map();
  }

  /**
   * Saves the id for an outgoing message in the correlation map.
   * @param {Object} input The input message
   * @returns The input decorated with a correlation id (if necessary)
   */
  addCorrelationId(input) {

    input.id = this.name + ':' + Date.now();
    this.messages.set(input.id, input);

    return input;
  }

  /**
   * Verifies that a response carries a known correlation id.
   * @Note If the correlation id is found in the messages map, it is removed.
   *
   * @param {Object} response The input response
   * @returns The verified response, or null if the response cannot be
   * verified.
   */
  verifyResponse(response) {
    let validated = this.messages.get(response.msg.reply);
    if (validated) {
      this.messages.delete(response.msg.reply);
    }

    return validated != undefined;
  }
}

module.exports = Correlator;
