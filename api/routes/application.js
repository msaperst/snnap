const express = require('express');
const pjson = require('../package.json');

const router = express.Router();

router.get('/version', async (req, res) => {
  res.send(pjson.version);
});

module.exports = router;
