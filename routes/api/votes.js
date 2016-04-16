var firebaseUrl = "https://jeffrey-xiao-reddit.firebaseio.com";

var express = require('express');

var router = express.Router();

router.route('/').post(function (req, res, next) {
	var id = req.body.id;
	var user = req.body.user;
	var url = req.body.url;
	var type = req.body.type;
	var post = req.body.currPost;
	var container = req.body.container;

	var firebaseVote = '';

	if (container == 'post')
		firebaseVote = new Firebase(firebaseUrl + "/posts/" + id);
	else if (container == 'comment')
		firebaseVote = new Firebase(firebaseUrl + "/posts/" + post + "/comments/" + req.body.url);

	var firebaseUser = new Firebase(firebaseUrl + "/users/" + req.body.user + "/data/votes/" + container);

	firebaseVote.once('value', function (snapshot) {
		var prevCount = parseInt(snapshot.val()['votes']);
		console.log(prevCount);
		firebaseUser.once('value', function (snapshot) {
			var prevVal = 0;
			if (snapshot.val() != null && snapshot.val()[id] != null)
				prevVal = parseInt(snapshot.val()[id]);

			var newVote = {};
			newVote[id] = type;
			console.log('API CALL');
			console.log(prevCount, type, prevVal);
			firebaseUser.update(newVote);
			firebaseVote.update({
				votes: prevCount + type - prevVal
			});
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end("Successfully voted!");
		});
	});
});

module.exports = router;