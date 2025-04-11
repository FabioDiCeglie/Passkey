const base64url = require('base64url');
const uuid = require('uuid').v4;
const passport = require('passport');

const register = (req, res) => {
  res.status(204).send();
};

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

module.exports = {
  register,
  createChallenge,
};
