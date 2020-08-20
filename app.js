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
app.get('/', function (req, res) {
  connection.query(
    'SELECT * FROM goods',
    function (error, result) {
      if (error) throw error;
      ///  console.log(result);
      let goods = {};
      for (let i = 0; i < result.length; i++) {
        goods[result[i]['id']] = result[i];
      }
      //console.log(goods);
      // console.log(JSON.parse(JSON.stringify(goods)));
      res.render('main', {
        foo: 'hello',
        bar: 7,
        goods: JSON.parse(JSON.stringify(goods))
      });
    }
  );
});
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
app.get('/cat', function (req, res) { // ...:3030/cat?id=1
  let catId = req.query.id || 1;
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
    res.render('cat', {
      cat: JSON.parse(JSON.stringify(value[0])),
      goods: JSON.parse(JSON.stringify(value[1]))
    });
    console.log('Download category.')
  });
  console.log(`Goods from category number ${catId} is downloading...`)
});

app.get('/goods', function (req, res) {
  connection.query('SELECT * FROM goods WHERE id=' + req.query.id, function (error, result, fields) {
    if (error) throw error;
    res.render('goods', { goods: JSON.parse(JSON.stringify(result)) });
  });
});

app.post('/get-category-list', function (req, res) {
  // console.log(req.body);
  connection.query('SELECT id, category FROM category', function (error, result, fields) {
    if (error) throw error;
    res.json(result);
  });
});

// server setting
app.listen(3030, function () {
  console.log('node express work on 3030');
});