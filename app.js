const express = require('express')
var port = process.env.PORT || 3000;
var app = express();
app.use(express.static('assets'))
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);

app.get('/', function (req, res) {
 res.json({ Hello: 'World'});
});

app.get('/template/meter-1', (req, res) => {
  res.render('metered.html')
});

app.listen(port, function () {
 console.log(`Example app listening on port !`);
});


