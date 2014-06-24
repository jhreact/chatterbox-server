/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var content = {results: []};

exports.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  //var path = url.parse(request.url).pathname;
  var postData = '';
  var result;
  console.log("Serving request type " + request.method + " for url " + request.url);

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  // TODO: Move this into routes or something like that
  if (request.method === 'POST') {
    var statusCode = 201;
    request.addListener('data', function(chunk) {
      postData += chunk;
    });
    request.addListener('end', function() {
      result = JSON.parse(postData);
      if (result) {
        content.results.push(result);
      }
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(content));
    });
  } else if (request.method === 'GET' &&
    (request.url === '/classes/messages' ||
      request.url === '/classes/room1' ||
      request.url === '/classes/chatterbox') ){
    var statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(content));
  } else {
    var statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end("404 Not found");
  }

};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

