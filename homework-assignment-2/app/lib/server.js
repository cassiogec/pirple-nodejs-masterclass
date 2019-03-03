/*
 *
 * Server-related tasks
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const path = require('path');
const util = require('util');
const config = require('./config');
const helpers = require('./helpers');
const router = require('./router');

const debug = util.debuglog('server');

// Instantiate the server module
const server = {};

// All the server logic for both the http and https server
server.unifiedServer = (req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const { headers } = req;

  // Get the payload
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found use the notFound handler
    const chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : router.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route the request to the handler specified on the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code callback by the handler, or default to 200
      statusCode = typeof statusCode === 'number' ? statusCode : 200;

      // Use the payload callback by the handler, or default to an empty object
      payload = typeof payload === 'object' ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // If the response is 200 print green, otherwise print red
      if (statusCode === 200) {
        debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} / ${trimmedPath} ${statusCode}`);
      } else {
        debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} / ${trimmedPath} ${statusCode}`);
      }
    });
  });
};

// Instantiate the HTTP server
server.httpServer = http.createServer(server.unifiedServer);

// Instantiate the HTTPS server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, './../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './../https/cert.pem')),
};

server.httpsServer = https.createServer(server.httpsServerOptions, server.unifiedServer);

// Init script
server.init = () => {
  // Start the HTTP server
  server.httpServer.listen(config.httpPort, () => {
    console.log('\x1b[36m%s\x1b[0m', `The HTTP server is listening on port ${config.httpPort}`);
  });

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log('\x1b[35m%s\x1b[0m', `The HTTPS server is listening on port ${config.httpsPort}`);
  });
};

module.exports = server;
