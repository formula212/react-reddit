var express = require('express');
var http = require('http');
var morgan = require('morgan');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var FileStore = require('session-file-store')(expressSession);

var apiCommentsRouter = require('./routes/api/comments');
var apiUsersRouter = require('./routes/api/users');
var apiVotesRouter = require('./routes/api/votes');

var hostname = 'localhost';
var port = 8080;

var srcPath = __dirname + '/assets';
var destPath = __dirname + '/assets';

var app = express();

//app.use(morgan('dev'));
app.use(sassMiddleware({
	src: srcPath,
	dest: destPath,
	debug: true,
	force: true,
	outputStyle: 'expanded'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({
	name: 'session-id',
	secret: '12345-67890-09876-54321',
	saveUninitialized: true,
	resave: true,
	store: new FileStore()
}));

app.use("/", express.static(__dirname + '/'));

app.use("/api/comments", apiCommentsRouter);
app.use("/api/users", apiUsersRouter);
app.use("/api/votes", apiVotesRouter);

app.listen(port, hostname, function () {
	console.log("Server is running at http://" + hostname + "/" + port);
});