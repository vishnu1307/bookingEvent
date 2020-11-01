const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors')
const index = require('./routes/index.routes')

//Init Express
const app = express();
require('./lib/upload')

//DB Connect
const db = require("./database/connection");

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }));

// app.use("/assets/images", express.static(path.join(__dirname, "../assets/images")));

//Router
app.use(index)
// app.use("/admin", express.static(path.join(__dirname, "public/admin")));
// app.use("/", express.static(path.join(__dirname, "public/customer")));
// app.use((req, res, next) => {
//   res.sendfile(path.join(__dirname, 'public/admin', 'index.html'));
// });



module.exports = app;
