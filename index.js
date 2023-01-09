if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const cors = require("cors");
const express = require("express");
const app = express();
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test' && !isSecure(req)) {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});
const path = require("path");
const initRoutes = require("./routes");

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

initRoutes(app);

let PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Running at localhost:${PORT}`);
});