const express = require('express')
const path = require('path');
const cors = require('cors')
const fs = require('fs');
const port = process.env.PORT || 3000;
const app = express();
const Engine = require('json-rules-engine').Engine


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

const matchesOperator = (factValue, jsonValue) => {
  if (!factValue) return false;
  const regexp = new RegExp(factValue);

  return regexp.test(jsonValue)
}

app.get('/rules', async (req, res) => {
  const { query } = req;
  const engine = new Engine([], {allowUndefinedFacts:true})
  engine.addOperator('matches', matchesOperator);


  const rulesPath = './rules'
  const ruleFiles = fs.readdirSync(rulesPath);
  ruleFiles.forEach(file => {
    const rule = fs.readFileSync(`${rulesPath}/${file}`).toString();
    engine.addRule(JSON.parse(rule));
  })

  engine.run(query).then(result => {
    const { events } = result || {};

    res.json(events);
  })
})

app.listen(port, function () {
 console.log(`Example app listening on port !`);
});


