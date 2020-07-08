const express = require('express')
const path = require('path');
const cors = require('cors')
const fs = require('fs');
var port = process.env.PORT || 3000;
var app = express();

app.use(cors())
app.use(express.static(path.join(__dirname, 'assets')))

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
 res.json({ Hello: 'World'});
});

app.get('/template/:template',  (req, res) => {
  // find JSON config matching the template param
  const jsonConfig = fs.readFileSync(path.join(__dirname, 'data', `${req.params.template}.json`), 'utf-8');
  if (jsonConfig) {

    // get file paths from config
    const { viewFile, baseCss, customStyles, ...config } = JSON.parse(jsonConfig);
    const styles = fs.readFileSync(`assets/css/${baseCss}`, 'utf-8')

    // render the template
    res.render(viewFile, {
      domain: process.env.DOMAIN,
      styles,
      ...config,
    })
  }
});

app.listen(port, function () {
 console.log(`Example app listening on port !`);
});


