/* define require process */

const pa11y = require('pa11y');
const express = require('express');

var port = process.env.PORT || 8080;

const app = express();

app.use(express.static('public'));

app.get('/api/test', async (req, res) => {
  'use strict';

  const notices = req.query.notice ?? false;
  const warnings = req.query.warn ?? false;

  console.log(`url: ${req.query.url}`);
  console.log(`notice: ${notices}`);
  console.log(`warn: ${warnings}`);

  if (!req.query.url) {
    res.status(400).json('Missing url parameter');
  } else {
    const results = await pa11y(req.query.url, {
      includeNotices: notices,
      includeWarnings: warnings,
      chromeLaunchConfig: {
        args: ['--no-sandbox']
      }
    });
    res.status(200).json(results);
  }
});

app.listen(port, () => {
  'use strict';

  console.log(`Listening on port: ${port}`);
});
