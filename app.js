//Require all the necessary middleware 
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const bCrypt = require('bcrypt');
const passport = require('passport');
const dotenv = require('dotenv').config();
const validator = require('express-validator');
const mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.DB_HOST}/rc-shopcart-test`);
require('./models/index');

const index = require('./routes/index');
const users = require('./routes/users');
const products = require('./routes/admin/product-route');
const auth = require('./routes/auth');
const app = express();


// CORS configuration
app.all('/*', function (req, res, next) {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});


// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname:'.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(passport.initialize());
require('./strategies/passport')(passport);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', passport.authenticate('jwt', {session:false}), users);
app.use('/auth', auth);
app.use('/admin/product-route',products);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
