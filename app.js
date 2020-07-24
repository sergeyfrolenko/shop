const http = require('http');
const fs = require('fs');

http.createServer(function (request, response) {
  response.end('Hello world');
}).listen(3000, () => {
  console.log('Server has starting on port 3000...');
});