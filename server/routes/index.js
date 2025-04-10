const express = require('express');
const router = express.Router();

router.get('/healthcheck', (req, res) => {
  res.status(204).send();
});

module.exports = router;