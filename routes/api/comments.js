var firebaseUrl = "https://jeffrey-xiao-reddit.firebaseio.com";

var express = require('express');

var router = express.Router();

router.route('/:id')
	.get(function (req, res, next) {
		var firebaseVal = new Firebase(firebaseUrl + "/posts/" + req.params.id + "/comments");
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
	});
router.route('').post(function (req, res, next) {
		var firebaseCount = new Firebase(firebaseUrl);
		firebaseCount.once('value', function (snapshot) {
			var key = snapshot.val()['commentCount'];

			firebaseCount.update(
				{commentCount: key + 1}
			);
			console.log(firebaseUrl + "/posts/" + req.body.currPost + "/comments/" + req.body.url + "/" + key);
			var firebaseComment = new Firebase(firebaseUrl + "/posts/" + req.body.currPost + "/comments/" + req.body.url + "/" + key);

			var comment = req.body.comment;
			comment['id'] = key;

			firebaseComment.set(comment);

			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end("Successfully added to firebase database!");
		});
	});

module.exports = router;