var firebaseUrl = "https://jeffrey-xiao-reddit.firebaseio.com";

var express = require('express');
var bcrypt = require('bcryptjs');

var router = express.Router();

router.route('/').get(function (req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	console.log(req.session.user);
	if (req.session.user != null && req.session.user != "") {
		var firebaseVal = new Firebase(firebaseUrl + "/users/" + req.session.user + "/data/");
		firebaseVal.once('value', function (snapshot) {
			var ret = snapshot.val();
			if (ret == null)
				ret = {};
			res.send(JSON.stringify({'name': req.session.user, 'val' : ret}));
		});
	} else
		res.send(JSON.stringify({'name': "", 'val' : {}}));
});

router.route('/login').post(function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var firebaseVal = new Firebase(firebaseUrl + "/users/" + username);
	firebaseVal.once('value', function (snapshot) {
		if (snapshot.val() == null) {
			res.status(400).send("User does not exist");
		} else if (bcrypt.hashSync(password, snapshot.val()['salt']) != snapshot.val()['password']) {
			res.status(400).send("Credentials supplied incorrect");
		} else {
			req.session.user = username;
			req.session.save();
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end("Successfully logged in");
		}
	});
});

router.route('/logout').post(function (req, res, next) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	if (req.session.user == null || req.session.user == "") {
		res.end("No user logged in");
	} else {
		req.session.user = "";
		req.session.save();
		res.end("Successfully logged out");
	}
});

router.route('/register').post(function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var salt = bcrypt.genSaltSync(10);

	var firebaseVal = new Firebase(firebaseUrl + "/users/" + username);
	firebaseVal.once('value', function (snapshot) {
		if (snapshot.val() != null)
			res.status(400).send("User already exists");
		else {
			req.session.user = username;
			req.session.save();
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end("Successfully registered");
			firebaseVal.update({password: bcrypt.hashSync(password, salt), email: email, salt: salt});
		}
	});
});

module.exports = router;