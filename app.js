let express = require('express');
let app = express();
const path = require('path');
const mysql = require('mysql');

// db connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'Node2020',
  database: 'market'
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

// routing
app.get('/db', function (req, res) {
  connection.query(
    'SELECT * FROM goods',
    function (error, result) {
      if (error) throw error;
      // console.log(result);
      let goods = {};
      for (let i = 0; i < result.length; i++) {
        goods[result[i]['id']] = result[i];
      }
      // console.log(goods);
      // console.log(JSON.parse(JSON.stringify(goods)));
      res.render('main', {
        foo: 'hello',
        bar: 7,
        goods: JSON.parse(JSON.stringify(goods))
      });
    }
  );
});
app.get('/main', function (req, res) {
  res.render('main', {
    title: 'My express',
    foo: 'hello',
    bar: 7
  });
});
app.get('/cat', function (req, res) {
  let catId = req.query.id;
  let cat = new Promise(function (resolve, reject) {
    connection.query(
      'SELECT * FROM category WHERE id=' + catId,
      function (error, result) {
        if (error) reject(err);
        resolve(result);
      });
  });
  let goods = new Promise(function (resolve, reject) {
    connection.query(
      'SELECT * FROM goods WHERE category=' + catId,
      function (error, result) {
        if (error) reject(err);
        resolve(result);
      });
  });

  Promise.all([cat, goods]).then(function (value) {
    console.log(value[0]);
    res.render('cat', {
      cat: JSON.parse(JSON.stringify(value[0])),
      goods: JSON.parse(JSON.stringify(value[1]))
    });
  });
  console.log('hi')
});

// server setting
app.listen(3000, function () {
  console.log('node express work on 3000');
});