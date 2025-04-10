const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const host = '0.0.0.0'

// Routes
app.use('/', require('./routes'));

app.listen(port, host, () => {
  console.log(`Example app listening on http://${host}:${port}`)
});