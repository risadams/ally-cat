const pa11y = require('pa11y');
const express = require('express');

var port = process.env.PORT || 8080;

const app = express();

app.use(express.static('public'));

app.get('/api/test', async (req, res) => {
  if (!req.query.url) {
    res.status(400).json('Missing url parameter');
  } else {
    const results = await pa11y(req.query.url, {
      chromeLaunchConfig: {
        args: ['--no-sandbox']
      }
    });
    res.status(200).json(results);
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
