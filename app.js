const express = require('express');
const app = express();

const path = require('path');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const expressSession = require('express-session');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./config/mongoose-connection');
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET || 'Rakesh@013',
  })
)

app.use(flash());

// console.log('Session Secret:', process.env.EXPRESS_SESSION_SECRET);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/product', productsRouter);
app.use('/owner', ownersRouter);
app.use('/user', usersRouter);

app.get("/admin/addProduct", (req, res) => {
  const selectedCategory = req.query.category || ""; // Get category from query parameters if available
  res.render("addProduct", { selectedCategory });
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
