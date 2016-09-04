var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

var conf = require('./conf/conf.json');
// routes
var routes = require('./routes/index');

var app = express();

//session
app.use(session({
    secret: 'coucousalifou',
    saveUninitialized:true,
    resave: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

var http = require('http');
http.createServer(app).listen(conf.port, function () {
    console.log("[info] Server started : listen on " + conf.port)
});
module.exports = app;