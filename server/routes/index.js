const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');

router.get('/healthcheck', (req, res) => {
  res.status(204).send();
});

router.get('/register', (req, res) => auth.register(req, res));

module.exports = router;