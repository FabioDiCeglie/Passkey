const express = require("express");
const multer = require('multer');
const db = require('./db/helpers/init');
const passport = require('passport')
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { initPassport } = require('./services/passport');
const sessionChallengeStore = require('passport-fido2-webauthn').SessionChallengeStore;

const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0'

const store = new sessionChallengeStore();

initPassport(store); // Initialize Passport with the session challenge store

const sessionStore = new SequelizeStore({
  db: db,
});

app.use(express.json());
app.use(multer().none()); // Middleware to handle multipart/form-data
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  }
}));
sessionStore.sync(); // Sync the session store with the database
app.use(passport.authenticate('session')); // Middleware to authenticate sessions with Passport


// Routes
app.use('/', require('./routes'));

app.listen(port, host, () => {
  console.log(`Example app listening on http://${host}:${port}`)
});