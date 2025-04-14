const base64url = require('base64url');
const uuid = require('uuid').v4;
const passport = require('passport');

const passportCheck = () => {
  return passport.authenticate('webauthn', {
      failureMessage: true,
      failWithError: true,
  })
}

const admitUser = (req, res) => {
  res.json({ ok: true })
}

const denyUser = (err, req, res, next) => {
  const cxx = Math.floor(err.status / 100)

  if (cxx != 4) return next(err)

  res.json({ ok: false })
}

const createChallenge = (req, res, store) => {
  const user = {
    id: uuid({}, Buffer.alloc(16)),
    name: req.body.username,
  };

  store.challenge(req, { user: user }, (err, challenge) => {
    if (err) return next(err);

    user.id = base64url.encode(user.id);

    res.json({
      user: user,
      challenge: base64url.encode(challenge),
    });
  });
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ ok: true });
  });
}

module.exports = {
  passportCheck,
  admitUser,
  denyUser,
  createChallenge,
  logout,
};
