var firebaseUrl = "https://jeffrey-xiao-reddit.firebaseio.com";

var express = require('express');

var router = express.Router();

router.route('/')
	.post(function (req, res, next) {

		var id = req.body.id;
		var user = req.body.user;
		var url = req.body.url;
		var type = req.body.type;
	
		var firebaseComment = new Firebase(firebaseUrl + "/comments/" + req.body.url);
	console.log(firebaseUrl + "/users/" + req.body.user + "/data/votes");
		var firebaseUser = new Firebase(firebaseUrl + "/users/" + req.body.user + "/data/votes");
		firebaseComment.once('value', function (snapshot) {
			var prevCount = parseInt(snapshot.val()['votes']);
			firebaseUser.once('value', function (snapshot) {
				var prevVal = 0;
				if (snapshot.val() != null && snapshot.val()[id] != null)
					prevVal = parseInt(snapshot.val()[id]);
				
				var newVote = {};
				newVote[id] = type;
				
				firebaseUser.update(newVote);
				firebaseComment.update({
					votes: prevCount + type - prevVal
				});
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end("Successfully voted!");
			});
		});
	
	
	});

module.exports = router;