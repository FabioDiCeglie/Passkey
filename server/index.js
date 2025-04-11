const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0'

const { initPassport } = require('./services/passport');
const sessionChallengeStore = require('./passport-fido2-webauthn').SessionChallenge;

const store = new sessionChallengeStore();

initPassport(store);

// Routes
app.use('/', require('./routes'));

app.listen(port, host, () => {
  console.log(`Example app listening on http://${host}:${port}`)
});