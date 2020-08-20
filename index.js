let express = require('express');
let app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3030, function () {
  console.log('node express work on 3030');
});