var firebaseUrl = "https://jeffrey-xiao-reddit.firebaseio.com";

var express = require('express');

var router = express.Router();

router.route('/')
	.get(function (req, res, next) {
		var firebaseVal = new Firebase(firebaseUrl + "/comments");
		var getComments = function (callback) {
			firebaseVal.once('value', function (snapshot) {
				callback(snapshot.val());
			});
		};

		getComments(function (comments) {
			res.setHeader('Content-Type', 'application/json');
			if (comments)
				res.send(JSON.stringify({'comments': comments}));
			else
				res.send(JSON.stringify({'comments': []}));
			return;
		});
	})
	
	.post(function (req, res, next) {
		var firebaseCount = new Firebase(firebaseUrl);
		firebaseCount.once('value', function (snapshot) {
			var key = snapshot.val()['count'];

			firebaseCount.update(
				{count: key + 1}
			);

			var firebaseComment = new Firebase(firebaseUrl + "/comments/" + req.body.url + "/" + key);

			var comment = req.body.comment;
			comment['id'] = key;

			firebaseComment.set(comment);

			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end("Successfully added to firebase database!");
		});
	});

module.exports = router;