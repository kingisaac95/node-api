/*
 * API entry point
 * 
*/

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

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

    // Parse payload to JSON
    buffer = JSON.parse(buffer)

  // Send response
  res.end('Hello World\n');

  // Log request details
  console.log('Request Payload:', buffer);
  });
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
