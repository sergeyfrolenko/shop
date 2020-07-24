let express = require('express');
let app = express();

// middleware
app.use(express.static('public'));

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