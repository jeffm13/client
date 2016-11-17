# Help.com Exercise

## Overview
A simple Newline-Delimited JSON client that communicates with the help.com test server at 104.198.157.112:9432.

## Prerequisites
To install and run the client, you'll need:
- [Git client](https://git-scm.com/)
- [Node.js](http://nodejs.org), version 6.9.X

To run tests (there aren't many, but there are a few), you'll need:
- [Mocha](https://mochajs.org/)
- [Istanbul](https://github.com/gotwarlost/istanbul)

## Installing the Client
To install the client program, clone this repository: 

    $ git clone https://github.com/jeffm13/client.git

If you'd like to run tests, you'll also need to: 

    $ cd <client directory>
    $ npm install

## Running the Client
To run the client program, start it with npm:

    $ npm start
    
The client program will display a command prompt:

    Connected to 104.198.157.112:9432
    Welcome ~~ foo!
    Client >

### Running tests

    $ npm test
    
### Running coverage analysis

    $ npm run coverage
    
Coverage analysis will be in the `coverage/lcov-report/index.html` file. 

Note that for the sake of time, I only included tests for the `buffered-stream.js` file. 

## Using the Client

The client program will accept several different commands, and raw json that it will send to the server.  

### Commands
#### Time
Sends a `time` request to the server.  It will display a response that looks something like this: 

    Client > time
    Response:
    Sender:	worker
    Time:	Thu Nov 17 02:50:30 2016
    Random:	8

#### Count
Sends a `count	` request to the server. It will display a response that looks something like this: 

    Client > count
    Response:
    Sender:	worker
    Count:	486
    
#### Show
Display errors originating from the server. The client will display something like this: 

    Client > show
    Timeout: no heartbeat in 2000 milliseconds
    Timeout: no heartbeat in 2000 milliseconds
    Timeout: no heartbeat in 2000 milliseconds
    Server Error: SyntaxError: Unexpected end of JSON input ({{"type" : "heartbeat", "epoch : 1479351195})
    Client >

#### Hide
Hide errors originating from the server (default). The client will suppress any error messages from errors originating on the server. 

#### Quit
Exits the client program.  A list of statistics will be displayed when the client program terminates. They may look something like this: 

    Client > quit
    Requests: 10
    Responses: 6
    Server Errors: 7
    Timeouts: 8
    Input Errors: 2

#### Raw JSON
You can enter raw JSON into the client, and it will send the JSON request to the server, and display any response: 

    Client > {"request":"time"}
    Response:
    Sender:	worker
    Time:	Thu Nov 17 02:56:34 2016
    Random:	30
    Client > {"request":"count"}
    Response:
    Sender:	worker
    Count:	489



## Implementation

The client program was implemented in Node.js.  It's pretty rudimentary--certainly not industrial strength.  But since it's a throw-away, that shouldn't be too surprising.  There are no external runtime dependencies, other than standard Node.js packages. Development dependencies only include testing tools.

The requirements state that:

> All messages to be send over the connection will be JSON as a single line. This is a "line delimited" protocol. Do not send linebreaks in your JSON, but explain how you will support them if you are requested to send them. 

Strictly speaking, inserting newlines into JSON would render it invalid.  However, newlines characters could be encoded, for example, with a `//n` marker. Both the server and the client would need to be capable of handling (encoding and decoding) the marker on both input and output. 

## Documentation

Documentation for the implementation can be found in [API.md](API.md). 