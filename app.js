var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var sass = require('node-sass-middleware');

var index = require('./routes/index');
var users = require('./routes/users');
var tictactoe = require('./routes/tictactoe');
var snake = require('./routes/snake');

var app = express();

// uruchomienie bazy mongod --dbpath C:/MongoDB/database
mongoose.connect('mongodb://127.0.0.1:27017/snake', { useMongoClient: true });


var hbs = expressHbs.create({
  // Specify helpers which are only registered on this instance.
  defaultLayout: 'layout', 
  extname: '.hbs',
  helpers: {
    inc: function (value) {  return parseInt(value) + 1; },
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    }
  }
});
// view engine setup
app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sass({
    src: __dirname + '/sass',
    dest: __dirname + '/public/stylesheets',
    prefix: '/stylesheets',
    debug: true,
  })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/materialize-css/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/materialize-css/dist/css'));

app.use('/', index);
app.use('/tictactoe', tictactoe);
app.use('/snake', snake);

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
