/*
 * API entry point
 * 
*/

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const isJSON = require('./utils/isJSON');

// Create server to handle all requests
const port = 3000;
const server = http.createServer((req, res) => {

  // Get request url and parse it
  const parsedUrl = url.parse(req.url, true);
  
  // Get path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  
  // Get querystring as an object
  const queryStringObject = parsedUrl.query;

  // Get request method
  const method = req.method.toLowerCase();

  // Get request headers
  const headers = req.headers;

  // Get payload
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // choose handler for requests
    const requestHandler = typeof(router[trimmedPath]) !== 'undefined' ?
      router[trimmedPath] : handlers.notFound;

    // Create request data to be passed into handler
    const data = {
      method,
      path: trimmedPath,
      query: queryStringObject,
      headers,
      payload: buffer,
    };

    // route to choosen handler
    requestHandler(data, (statusCode, payload) => {
      // Use status code param or default to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
      
      // Use payload param or default to {}
      payload = typeof(payload) === 'object' ? payload : {};

      // Convert callback payload to a string
      const payloadString = JSON.stringify(payload);

      // Return response to caller
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log response details
      console.log('Response:', statusCode, payloadString);
    });
  });
});

server.listen(port, () => console.log(`Server listening on port ${port}`));

// Define request handlers
const handlers = {};

// Test handler
handlers.test = (data, callback) => {
  // Parse payload to JSON, if any
  // isJSON(data) ? buffer = JSON.parse(data) : '';

  callback(406, {
    name: 'Test handler',
  });
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Define request router
const router = {
  'test': handlers.test,
};
