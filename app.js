var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require("connect-flash");

/** Principal variable */
var app = express();

/** Import routes */
var index = require('./routes/index');
var users = require('./routes/users');
var appanel = require('./routes/appanel');
var security = require("./routes/security");
var posts = require("./routes/post");
var api = require("./routes/api");

/** Import mongodb config */
var mongoCfg = require('./config/mongo');
var mongoose = require('mongoose');
mongoose.connect(mongoCfg.url);

/** For flash message */
app.use(flash());

/** Configuring Passport */
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'thisneedtobefuckingsecret', expiration: 60000}));
app.use(passport.initialize());
app.use(passport.session());

/** Just require to load the config */
require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/appanel', appanel);
app.use('/appanel', security);
app.use('/appanel/posts', posts);
app.use('/api', api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;