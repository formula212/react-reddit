var React = require('react');
var Comment = require('./comment.jsx');

module.exports = React.createClass({
	contextTypes: {
		activeComment: React.PropTypes.string,
		prevComponent: React.PropTypes.object
	},
	
	handleCommentSubmit: function (comment, url) {
		this.props.onCommentSubmit(comment, url);
	},
	
	handleVoteSubmit: function (id, url, type) {
		this.props.onVoteSubmit(id, url, type);
	},
	
	render: function () {
		if (this.props.data) {
			var comments = this.props.data;
			var currComponent = this;
			var commentNodes = Object.keys(comments).map(function (key) {
				return (
					<Comment 
						key={comments[key].id} 
						data={comments[key]} 
						onCommentSubmit={currComponent.handleCommentSubmit}
						onVoteSubmit={currComponent.handleVoteSubmit}
						user={currComponent.props.user}>
						{comments[key].text}
					</Comment>
				);
			});
			return (
				<div className="commentList">
					{commentNodes}
				</div>
			);
		} else {
			return (<noscript/>);
		}
	}
});