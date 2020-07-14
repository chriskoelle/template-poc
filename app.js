const express = require('express')
const path = require('path');
const cors = require('cors')
const fs = require('fs');
const port = process.env.PORT || 3000;
const app = express();
const Engine = require('json-rules-engine').Engine

app.use(cors())
app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.json())

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
 res.json({ Hello: 'World'});
});

/**
 * Get a template by ID
 */
app.get('/template/:template',  (req, res) => {
  // find JSON config matching the template param
  const jsonConfig = fs.readFileSync(path.join(__dirname, 'data', `${req.params.template}.json`), 'utf-8');
  if (jsonConfig) {

    // get file paths from config
    const { viewFile, baseCss, customStyles, ...config } = JSON.parse(jsonConfig);
    const styles = fs.readFileSync(`assets/css/${baseCss}`, 'utf-8')

    // render the template view
    res.render(viewFile, {
      domain: process.env.DOMAIN,
      styles,
      ...config,
    })
  }
});

/**
 * Custom operator to match a regular expression
 */
const matchesOperator = (factValue, jsonValue) => {
  if (!factValue) return false;
  const regexp = new RegExp(jsonValue);

  return regexp.test(factValue)
}


/**
 * Find rules for a given brand that match the provided facts
 *
 * @param {string} brand The brand
 * @param {Object} facts The facts to check the rules against
 * @return {Object[]} Array of events from matching rules
 */
const findMatchingRules = async (brand, facts) => {
  const engine = new Engine([], {
    allowUndefinedFacts: true
  })
  // add custom operator
  engine.addOperator('matches', matchesOperator);


  const rulesPath = `./rules/${brand}`
  const ruleFiles = fs.readdirSync(rulesPath);
  ruleFiles.forEach(file => {
    const rule = fs.readFileSync(`${rulesPath}/${file}`).toString();
    engine.addRule(JSON.parse(rule));
  })

  const {events} = await engine.run(facts)
  return events || []
}


/**
 * POST endpoint for /rules/:brand
 */
app.post('/rules/:brand', async (req, res) => {
  const { body, params: { brand } } = req;

  const events = await findMatchingRules(brand, body);
    res.json(events);
})

/**
 * GET endpoint for /rules
 *
 * for easily testing rules in the browser
 */
app.get('/rules', async (req, res) => {
  const { query: {brand = 'cosmo', ...query} } = req;

  const events = await findMatchingRules(brand, query);
    res.json(events);
})

app.listen(port, function () {
 console.log(`Listening on port ${port}!`);
});


