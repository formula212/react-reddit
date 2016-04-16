var firebaseUrl = "https://jeffrey-xiao-reddit.firebaseio.com";

var express = require('express');

var router = express.Router();

router.route('/')
	.get(function (req, res, next) {
		res.setHeader('Content-Type', 'application/json');
		var firebaseComment = new Firebase(firebaseUrl);
		firebaseComment.once('value', function (snapshot) {
			var ret = snapshot.val()['posts'];
			if (ret == null)
				ret = {};
			res.send(JSON.stringify({'posts': ret}));
		});
	})
	
	.post(function (req, res, next) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		var firebaseCount = new Firebase(firebaseUrl);
		firebaseCount.once('value', function (snapshot) {
			var key = snapshot.val()['postCount'];
			
			firebaseCount.update(
				{postCount: key + 1}
			);
			
			var firebasePost = new Firebase(firebaseUrl + "/posts/" + key);
			
			var post = req.body.post;
			post['id'] = key;
			
			firebasePost.set(post);
			res.end("Successfully added to firebase database!");
		});
	});

module.exports = router;