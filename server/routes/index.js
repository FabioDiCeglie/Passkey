const express = require('express');
const router = express.Router();
const { store } = require('../index');

const { register, createChallenge } = require('../controllers/auth');

router.get('/healthcheck', (req, res) => {
  res.status(204).send();
});

router.get('/register', (req, res) => register(req, res));
router.post('/register/public-key/challenge', (req, res) => createChallenge(req, res, store));

module.exports = router;