## Classes

<dl>
<dt><a href="#BufferedStream">BufferedStream</a> : <code><a href="#BufferedStream">BufferedStream</a></code></dt>
<dd><p>A primitive buffered stream implementation to enable the client to deal
with payloads that have been split into multiple chunks and payloads that
contain more than one message.</p>
</dd>
<dt><a href="#Correlator">Correlator</a> : <code><a href="#Correlator">Correlator</a></code></dt>
<dd><p>Correlates responses with requests. Non-correlated messages are ignored.</p>
</dd>
<dt><a href="#NDJClient">NDJClient</a> : <code><a href="#NDJClient">NDJClient</a></code></dt>
<dd><p>A simple newline-delimited JSON (ndj) client</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#readline">readline</a></dt>
<dd><p>Main module for the Client app</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#checkHeartBeat">checkHeartBeat()</a></dt>
<dd><p>Verifies that the connection to the server is healthy by checking that a regular
heartbeat message is received from the server every TIMEOUT_INTERVAL seconds.
If the connection times out, the client reconnects</p>
</dd>
<dt><a href="#connect">connect()</a></dt>
<dd><p>Connects to the server and logs in.  Login occurs LOGIN_INTERVAL
milliseconds after connection.</p>
</dd>
<dt><a href="#login">login()</a></dt>
<dd><p>Logs in to the server by sending a &quot;name&quot; message.  Login name is currently
hard-coded to LOGIN_NAME</p>
</dd>
<dt><a href="#reconnect">reconnect()</a></dt>
<dd><p>Reconnects to the server by clearing the heartbeat interval, disconnecting
the client, and scheduling a connect for RECONNECT_INTERVAL milliseconds after
disconnection.</p>
</dd>
<dt><a href="#showConnected">showConnected()</a></dt>
<dd><p>Displays a connection message.  Only displayed on the first login.</p>
</dd>
<dt><a href="#showError">showError(error)</a></dt>
<dd><p>Displays an error message for errors received from the server. Also shows
the last message received from the server.</p>
</dd>
<dt><a href="#printMessage">printMessage(text)</a></dt>
<dd><p>Prints a message to the console.  Uses clearLine and cursorTo as a feeble
attempt to improve usability.</p>
</dd>
<dt><a href="#processResponse">processResponse(message)</a></dt>
<dd><p>Processes response messages</p>
</dd>
<dt><a href="#processMessage">processMessage(message)</a></dt>
<dd><p>Processes messages.  Note that a map would be more efficient here...</p>
</dd>
<dt><a href="#shutdown">shutdown()</a></dt>
<dd><p>Displays usage statistics and exits the process, shutting down the client</p>
</dd>
<dt><a href="#acceptInput">acceptInput()</a></dt>
<dd><p>Accepts input from the user using the standard readLine interface.  Parses
JSON input, adds a correlation id to the parsed object, and sends it to the
server.</p>
</dd>
<dt><a href="#start">start()</a></dt>
<dd><p>Drive the client.  Initializes the connection, sets up event listeners, sets
the corellator, and accepts input from the user.</p>
</dd>
</dl>

<a name="BufferedStream"></a>

## BufferedStream : <code>[BufferedStream](#BufferedStream)</code>
A primitive buffered stream implementation to enable the client to deal
with payloads that have been split into multiple chunks and payloads that
contain more than one message.

**Kind**: global class  

* [BufferedStream](#BufferedStream) : <code>[BufferedStream](#BufferedStream)</code>
    * [new BufferedStream(stream)](#new_BufferedStream_new)
    * ["message"](#BufferedStream+event_message)
    * ["error"](#BufferedStream+event_error)

<a name="new_BufferedStream_new"></a>

### new BufferedStream(stream)
Creates a buffered stream wrappend around another stream. Treats each
chunk of data between newlines as a 'message'.


| Param | Type | Description |
| --- | --- | --- |
| stream | <code>Stream</code> | the stream that this object will buffer (eg., a socket) |

<a name="BufferedStream+event_message"></a>

### "message"
Message event is a string containing the text of the message

**Kind**: event emitted by <code>[BufferedStream](#BufferedStream)</code>  
<a name="BufferedStream+event_error"></a>

### "error"
Error event

**Kind**: event emitted by <code>[BufferedStream](#BufferedStream)</code>  
<a name="Correlator"></a>

## Correlator : <code>[Correlator](#Correlator)</code>
Correlates responses with requests. Non-correlated messages are ignored.

**Kind**: global class  

* [Correlator](#Correlator) : <code>[Correlator](#Correlator)</code>
    * [.addCorrelationId(input)](#Correlator+addCorrelationId) ⇒
    * [.verifyResponse(response)](#Correlator+verifyResponse) ⇒

<a name="Correlator+addCorrelationId"></a>

### correlator.addCorrelationId(input) ⇒
Saves the id for an outgoing message in the correlation map.

**Kind**: instance method of <code>[Correlator](#Correlator)</code>  
**Returns**: The input decorated with a correlation id (if necessary)  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>Object</code> | The input message |

<a name="Correlator+verifyResponse"></a>

### correlator.verifyResponse(response) ⇒
Verifies that a response carries a known correlation id.

**Kind**: instance method of <code>[Correlator](#Correlator)</code>  
**Returns**: The verified response, or null if the response cannot be
verified.  
**Note**: If the correlation id is found in the messages map, it is removed.  

| Param | Type | Description |
| --- | --- | --- |
| response | <code>Object</code> | The input response |

<a name="NDJClient"></a>

## NDJClient : <code>[NDJClient](#NDJClient)</code>
A simple newline-delimited JSON (ndj) client

**Kind**: global class  

* [NDJClient](#NDJClient) : <code>[NDJClient](#NDJClient)</code>
    * [new NDJClient(port, host)](#new_NDJClient_new)
    * [.connect()](#NDJClient+connect)
    * [.disconnect()](#NDJClient+disconnect)
    * [.write()](#NDJClient+write)
    * [.getLastInbound()](#NDJClient+getLastInbound)
    * [.setCorrelator()](#NDJClient+setCorrelator)
    * ["connected"](#NDJClient+event_connected)
    * ["message"](#NDJClient+event_message)
    * ["error"](#NDJClient+event_error)

<a name="new_NDJClient_new"></a>

### new NDJClient(port, host)
Saves the host and port used to create the instance.


| Param | Type | Description |
| --- | --- | --- |
| port | <code>Number</code> | The port number on the server |
| host | <code>String</code> | The host address |

<a name="NDJClient+connect"></a>

### ndjClient.connect()
Connects to the server

**Kind**: instance method of <code>[NDJClient](#NDJClient)</code>  
**Emits**: <code>[connected](#NDJClient+event_connected)</code>, <code>[message](#NDJClient+event_message)</code>, <code>[error](#NDJClient+event_error)</code>  
<a name="NDJClient+disconnect"></a>

### ndjClient.disconnect()
Disconnect the client from the server (per requirements) when timeouts
are received.

**Kind**: instance method of <code>[NDJClient](#NDJClient)</code>  
<a name="NDJClient+write"></a>

### ndjClient.write()
Writes a message to the server.

**Kind**: instance method of <code>[NDJClient](#NDJClient)</code>  
<a name="NDJClient+getLastInbound"></a>

### ndjClient.getLastInbound()
Returns the last inbound (unparsed) message

**Kind**: instance method of <code>[NDJClient](#NDJClient)</code>  
<a name="NDJClient+setCorrelator"></a>

### ndjClient.setCorrelator()
Sets the correlator that verifies correlated responses

**Kind**: instance method of <code>[NDJClient](#NDJClient)</code>  
<a name="NDJClient+event_connected"></a>

### "connected"
Fired when the client is connected to the server

**Kind**: event emitted by <code>[NDJClient](#NDJClient)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| port | <code>Number</code> | The server port number |
| host | <code>String</code> | The server host address |

<a name="NDJClient+event_message"></a>

### "message"
Message emitted by the buffered socket. Message has been
parsed from the JSON received from the server and, if a 'msg'
type, had its correlation id verified.

**Kind**: event emitted by <code>[NDJClient](#NDJClient)</code>  
<a name="NDJClient+event_error"></a>

### "error"
Error encountered when parsing raw JSON message from the server

**Kind**: event emitted by <code>[NDJClient](#NDJClient)</code>  
<a name="readline"></a>

## readline
Main module for the Client app

**Kind**: global constant  
<a name="checkHeartBeat"></a>

## checkHeartBeat()
Verifies that the connection to the server is healthy by checking that a regular
heartbeat message is received from the server every TIMEOUT_INTERVAL seconds.
If the connection times out, the client reconnects

**Kind**: global function  
<a name="connect"></a>

## connect()
Connects to the server and logs in.  Login occurs LOGIN_INTERVAL
milliseconds after connection.

**Kind**: global function  
<a name="login"></a>

## login()
Logs in to the server by sending a "name" message.  Login name is currently
hard-coded to LOGIN_NAME

**Kind**: global function  
<a name="reconnect"></a>

## reconnect()
Reconnects to the server by clearing the heartbeat interval, disconnecting
the client, and scheduling a connect for RECONNECT_INTERVAL milliseconds after
disconnection.

**Kind**: global function  
<a name="showConnected"></a>

## showConnected()
Displays a connection message.  Only displayed on the first login.

**Kind**: global function  
<a name="showError"></a>

## showError(error)
Displays an error message for errors received from the server. Also shows
the last message received from the server.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>Error</code> | The error received from the server |

<a name="printMessage"></a>

## printMessage(text)
Prints a message to the console.  Uses clearLine and cursorTo as a feeble
attempt to improve usability.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | message to display |

<a name="processResponse"></a>

## processResponse(message)
Processes response messages

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | The message to process |

<a name="processMessage"></a>

## processMessage(message)
Processes messages.  Note that a map would be more efficient here...

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | Message object received from the server |

<a name="shutdown"></a>

## shutdown()
Displays usage statistics and exits the process, shutting down the client

**Kind**: global function  
<a name="acceptInput"></a>

## acceptInput()
Accepts input from the user using the standard readLine interface.  Parses
JSON input, adds a correlation id to the parsed object, and sends it to the
server.

**Kind**: global function  
<a name="start"></a>

## start()
Drive the client.  Initializes the connection, sets up event listeners, sets
the corellator, and accepts input from the user.

**Kind**: global function  
