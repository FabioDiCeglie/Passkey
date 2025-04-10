const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const host = '0.0.0.0'

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});