const express = require('express')
const path = require('path');
const cors = require('cors')
var port = process.env.PORT || 3000;
var app = express();

app.use(cors())
app.use(express.static(path.join(__dirname, 'assets')))

app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);

app.get('/', function (req, res) {
 res.json({ Hello: 'World'});
});

app.get('/template/meter-1', (req, res) => {
  res.render('metered.html', {
    domain: process.env.DOMAIN,
  })
});

app.listen(port, function () {
 console.log(`Example app listening on port !`);
});


