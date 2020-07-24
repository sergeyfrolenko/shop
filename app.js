let express = require('express');
let app = express();
const path = require('path');

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

// routing
app.get('/main', function (req, res) {
  res.render('main', {
    title: 'My express',
    foo: 'hello',
    bar: 7
  });
});
app.get('/cat', function (req, res) {
  res.end('cat');
});

// server setting
app.listen(3000, function () {
  console.log('node express work on 3000');
});