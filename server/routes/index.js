const express = require('express');
const router = express.Router();
const { initPassport } = require('../services/passport');
const sessionChallengeStore = require('passport-fido2-webauthn').SessionChallengeStore;

const store = new sessionChallengeStore();

initPassport(store); // Initialize Passport with the session challenge store

const { createChallenge, passportCheck, admitUser, denyUser } = require('../controllers/auth');

router.get('/healthcheck', (req, res) => {
  res.status(204).send();
});

router.post('/login/public-key',
  passportCheck(),
  admitUser,
  denyUser
);
router.post('/register/public-key/challenge', (req, res) => createChallenge(req, res, store));

module.exports = router;