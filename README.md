# Shop

## Code snippets

create server
```javascript
const http = require('http');
const fs = require('fs');

http.createServer(function (request, response) {
  response.end('Hello world');
}).listen(3000, () => {
  console.log('Server has starting on port 3000...');
});
```

create server on express.js
```javascript
let express = require('express');
let app = express();

// middleware
app.use(express.static('public'));
app.set('view engine', 'pug');
// routing
app.get('/', function (req, res) {
  console.log("/");
  res.render('index.html');
});
app.get('/cat', function (req, res) {
  res.end('cat');
});

// server setting
app.listen(3000, function () {
  console.log('node express work on 3000');
});
```