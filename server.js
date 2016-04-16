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
var apiPostsRouter = require('./routes/api/posts');

var firebaseUrl = "https://jeffrey-xiao-reddit.firebaseio.com";
var hostname = 'localhost';
var port = 8080;

var srcPath = __dirname + '/assets';
var destPath = __dirname + '/assets';

var app = express();

app.set('views', __dirname + '/views/pages');
app.set('view engine', 'jade');

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

app.get('/', function (req, res, next) {
	res.render('home', {
		title: 'Front Page'
	});
});

app.use("/api/comments", apiCommentsRouter);
app.use("/api/users", apiUsersRouter);
app.use("/api/votes", apiVotesRouter);
app.use("/api/posts", apiPostsRouter);

app.use(express.static(__dirname));

app.get('/:id', function (req, res, next) {
	console.log(req.params.id);
	var firebaseVal = new Firebase(firebaseUrl + "/posts/" + req.params.id);
	firebaseVal.once('value', function (snapshot) {
		if (snapshot.val() == null) {
			res.render('404', {
				title: '404'	   
			});
		} else {
			res.render('post', {
				title: snapshot.val()['title']
			});
		}
	});
});

app.listen(port, hostname, function () {
	console.log("Server is running at http://" + hostname + "/" + port);
});