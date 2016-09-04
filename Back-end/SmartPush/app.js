var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//configuration
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

app.all('*', function(req, res,next) {
	var responseSettings = {
		"AccessControlAllowOrigin": req.headers.origin,
		"AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
		"AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
		"AccessControlAllowCredentials": true
	};
	res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
	res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
	res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
	res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);
	if ('OPTIONS' == req.method) {
		res.send(200);
	}
	else {
		next();
	}


});

app.use('/', routes);

var http = require('http');
http.createServer(app).listen(conf.port, function () {
	console.log("[info] Server started : listen on " + conf.port)
});
module.exports = app;