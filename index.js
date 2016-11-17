'use strict';

/**
 * Main module for the Client app
 */

const readline = require('readline');
const NDJClient = require('./ndj-client');
const Correlator = require('./correlator');
const os = require('os');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Client > '
});

const HOST = '104.198.157.112';
const PORT = 9432;
//const HOST = '127.0.0.1';
//const PORT = 5432;
const TIMEOUT_INTERVAL = 2000;
const RECONNECT_INTERVAL = 500;
const LOGIN_INTERVAL = 500;
const USER_NAME = 'foo';
const TIME_REQUEST = {'request': 'time'};
const COUNT_REQUEST = {'request': 'count'};

var displayErrors = false;
var client;
var correlator;
var lastBeat = 0;
var interval;
var connected = false;
var loggedIn = false;
var timeoutCount = 0;
var serverErrorCount = 0;
var inputErrorCount = 0;
var requestCount = 0;
var responseCount = 0;

/**
 * Verifies that the connection to the server is healthy by checking that a regular
 * heartbeat message is received from the server every TIMEOUT_INTERVAL seconds.
 * If the connection times out, the client reconnects
 */
function checkHeartBeat() {
  interval = setInterval(() => {
    var now = Date.now();
    if (lastBeat && now > lastBeat + TIMEOUT_INTERVAL + 10) {
      if (displayErrors) {
        printMessage(
          `Timeout: no heartbeat in ${TIMEOUT_INTERVAL} milliseconds`);
      }
      timeoutCount++;
      reconnect();
    }
  }, TIMEOUT_INTERVAL)
}

/**
 * Connects to the server and logs in.  Login occurs LOGIN_INTERVAL
 * milliseconds after connection.
 */
function connect() {
  client.connect();
  setTimeout(() => login(), LOGIN_INTERVAL);
}

/**
 * Logs in to the server by sending a "name" message.  Login name is currently
 * hard-coded to LOGIN_NAME
 */
function login() {
  let user = `{"name":"${USER_NAME}"}`;
  client.write(user, false);
}

/**
 * Reconnects to the server by clearing the heartbeat interval, disconnecting
 * the client, and scheduling a connect for RECONNECT_INTERVAL milliseconds after
 * disconnection.
 */
function reconnect() {
  lastBeat = 0;
  clearInterval(interval);
  interval = null;
  client.disconnect();
  setTimeout(() => connect(), RECONNECT_INTERVAL);
}

/**
 * Displays a connection message.  Only displayed on the first login.
 */
function showConnected() {
  if (!connected) {
    printMessage('Connected to ' + HOST + ':' + PORT);
    connected = true;
  }
}

/**
 * Displays an error message for errors received from the server. Also shows
 * the last message received from the server.
 * @param  {Error} error The error received from the server
 */
function showError(error) {
  serverErrorCount++;
  if (displayErrors) {
    printMessage(`Server Error: ${error} ({${client.getLastInbound()})`);
  }
}

/**
 * Prints a message to the console.  Uses clearLine and cursorTo as a feeble
 * attempt to improve usability.
 * @param  {String} text message to display
 */
function printMessage(text) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(text);
  rl.prompt();
}

/**
 * Processes response messages
 * @param  {Object} message The message to process
 */
function processResponse(response) {
  responseCount++;
  printMessage(`Response: \nSender:\t${response.sender}`);
  if (response.msg.time) {
    printMessage('Time:\t' + response.msg.time);
    printMessage('Random:\t' + response.msg.random);
    if (response.msg.random > 30) {
      printMessage('Random is greater than 30');
    }
  } else if (response.msg.count) {
    printMessage('Count:\t' + response.msg.count);
  }
}

/**
 * Processes messages.  Note that a map would be more efficient here...
 * @param  {Object} message Message object received from the server
 */
function processMessage(message) {
  if (!message.type)
    return;

  switch (message.type) {
  case 'msg':
    processResponse(message);
    break;

  case 'welcome':
    if (!loggedIn) {
      printMessage(message.msg);
      loggedIn = true;
    }
    break;

  case 'heartbeat':
    if (!interval)
      interval = checkHeartBeat();
    lastBeat = Date.now();
    break;

  case 'error':
    inputErrorCount++;
    printMessage('Request Error: ' + message.message);
    break;
  }
}

/**
 * Displays usage statistics and exits the process, shutting down the client
 */
function shutdown() {
  printMessage('Requests: ' + requestCount);
  printMessage('Responses: ' + responseCount);
  printMessage('Server Errors: ' + serverErrorCount);
  printMessage('Timeouts: ' + timeoutCount);
  printMessage('Input Errors: ' + inputErrorCount);
  process.exit(0);
}

/**
 * Accepts input from the user using the standard readLine interface.  Input can
 * be one of the following:  'time', 'count', 'quit', 'show', 'hide' or raw json.
 */
function acceptInput() {

  rl.on('line', (input) => {

    if (input.length == 0) {
      rl.prompt();

      return;
    }

    try {

      let request;
      requestCount++;
      if (input.indexOf('{') === 0) {
        request = JSON.parse(input);
      } else if (input === 'time') {
        request = TIME_REQUEST;
      } else if (input === 'count') {
        request = COUNT_REQUEST;
      } else if (input === 'quit') {
        shutdown();

        return;
      } else if (input === 'show') {
        displayErrors = true;
        rl.prompt();

        return;
      } else if (input === 'hide') {
        displayErrors = false;
        rl.prompt();

        return;
      } else {
        throw (new Error('unknown command'));
      }
      request = correlator.addCorrelationId(request);
      client.write(JSON.stringify(request));

    } catch (error) {

      let reportedError = {}
      reportedError.type = 'error';
      reportedError.cause = 'parse';
      reportedError.message = error;
      processMessage(reportedError);
    }

    rl.prompt();
  })
}


/**
 * Drive the client.  Initializes the connection, sets up event listeners, sets
 * the corellator, and accepts input from the user.
 */
function start() {
  client = new NDJClient(PORT, HOST);

  client.on('message', processMessage);
  client.on('connected', showConnected);
  client.on('error', showError);
  process.on('SIGINT', () => shutdown());

  correlator = new Correlator(os.hostname());
  client.setCorrelator(correlator);

  connect();
  acceptInput(client);
}

start();
