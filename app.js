let express = require('express');
var bodyParser = require('body-parser');
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
app.use(bodyParser.json());

// routing
app.get('/', function (req, res) {
  let cat = new Promise(function (resolve, reject) {
    connection.query(
      "select id,name, cost, image, category from (select id,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, '') != '', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := '' ) v ) goods where ind < 3",
      function (error, result, field) {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
  let catDescription = new Promise(function (resolve, reject) {
    connection.query(
      "SELECT * FROM category",
      function (error, result, field) {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
  let cats = new Promise(function (resolve, reject) {
    connection.query(
      'SELECT * FROM category',
      function (error, result) {
        if (error) reject(err);
        resolve(result);
      });
  });
  Promise.all([cats, cat, catDescription]).then(function (value) {
    res.render('index', {
      cats: JSON.parse(JSON.stringify(value[0])),
      cat: JSON.parse(JSON.stringify(value[2])),
      goods: JSON.parse(JSON.stringify(value[1]))
    });
  });
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
app.get('/cat', function (req, res) { // ...:3030/cat?id=1
  let catId = req.query.id || 1;
  let cats = new Promise(function (resolve, reject) {
    connection.query(
      'SELECT * FROM category',
      function (error, result) {
        if (error) reject(err);
        resolve(result);
      });
  });
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

  Promise.all([cats, cat, goods]).then(function (value) {
    res.render('cat', {
      cats: JSON.parse(JSON.stringify(value[0])),
      cat: JSON.parse(JSON.stringify(value[1])),
      goods: JSON.parse(JSON.stringify(value[2]))
    });
  });
});

app.get('/goods', function (req, res) {
  let catId = req.query.id || 1;
  let goods = new Promise(function (resolve, reject) {
    connection.query(
      'SELECT * FROM goods WHERE id=' + catId,
      function (error, result) {
        if (error) reject(err);
        resolve(result);
      });

  });
  let cats = new Promise(function (resolve, reject) {
    connection.query(
      'SELECT * FROM category',
      function (error, result) {
        if (error) reject(err);
        resolve(result);
      });
  });
  Promise.all([cats, goods]).then(function (value) {
    res.render('goods', {
      cats: JSON.parse(JSON.stringify(value[0])),
      goods: JSON.parse(JSON.stringify(value[1]))
    });
  });
});
app.get('/order', function (req, res) {
  res.render('order');
});

app.post('/get-category-list', function (req, res) {
  connection.query('SELECT id, category FROM category', function (error, result, fields) {
    if (error) throw error;
    res.json(result);
  });
});
app.post('/get-goods-info', function (req, res) {
  const keys = Object.keys(req.body);
  if (keys.length != 0) {
    connection.query('SELECT id, name, cost FROM goods WHERE id IN (' + keys.join(',') + ')', function (error, result) {
      if (error) throw error;
      const goods = {};
      for (let i = 0; i < result.length; i++) {
        goods[result[i]['id']] = result[i];
      }
      res.json(goods);
    });
  } else {
    res.send('0');
  }
});

// server setting
app.listen(3030, function () {
  console.log('node express work on 3030');
});