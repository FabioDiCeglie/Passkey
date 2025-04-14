const express = require('express');
const router = express.Router();
const { initPassport } = require('../services/passport');
const passport = require('passport');
const sessionChallengeStore =
  require('passport-fido2-webauthn').SessionChallengeStore;

const store = new sessionChallengeStore();
initPassport(store); // Initialize Passport with the session challenge store

const {
  createChallenge,
  admitUser,
  denyUser,
  logout,
} = require('../controllers/auth');

router.get('/healthcheck', (req, res) => {
  res.status(204).send();
});

router.post('/register/public-key/challenge', (req, res) =>
  createChallenge(req, res, store)
);
router.post(
  '/login/public-key',
  passport.authenticate('webauthn', {
    failureMessage: true,
    failWithError: true,
  }),
  admitUser,
  denyUser
);
router.post('/logout', logout);

module.exports = router;
