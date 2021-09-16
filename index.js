// npm install -g nodemon
// const PORT = 3000;

const express = require("express");
const app = express();


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(require("./routers/index"));


// app.listen(PORT, () => {
//   console.log("McDonalds API Running...");
// });

// heroku
app.listen(process.env.PORT, () => {
  console.log("McDonalds API Running...");
});

