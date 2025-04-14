const express = require("express");
const cors = require('cors');
const multer = require('multer');
const db = require('./db/helpers/init');
const cookieParser = require('cookie-parser');
const passport = require('passport')
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const port = process.env.PORT || 3000;

const sessionStore = new SequelizeStore({
  db: db,
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(multer().none()); // Middleware to handle multipart/form-data
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
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

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
});