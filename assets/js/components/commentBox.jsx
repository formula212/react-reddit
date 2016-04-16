var React = require('react');
var $ = require('jquery');

var CommentList = require('./comments.jsx').CommentList;
var CommentForm = require('./commentForm.jsx');

module.exports = React.createClass({
	childContextTypes: {
		activeComment: React.PropTypes.string,
		root: React.PropTypes.object
	},
	
	getChildContext: function () {
		var activeComment = "";
		if (window.location.hash.length > 0)
			activeComment = window.location.hash.substr(9);
		return {
			activeComment: activeComment,
			root: this
		}
	},
	
	loadComments: function () {
		var currPost = window.location.pathname.substr(1);
		$.ajax({
			url: '/api/comments/'+currPost,
			dataType: 'json',
			cache: false,
			success: function (data) {
				this.setState({data: data['comments']});
			}.bind(this),
			error: function (xhr, status, error) {
				console.error('/api/comments/'+currPost, status, error.toString());
			}.bind(this)
		});
	},
	
	loadUser: function (ballback) {
		var currPost = window.location.pathname.substr(1);
		$.ajax({
			url: '/api/users',
			dataType: 'json',
			cache: false,
			success: function (data) {
				this.setState({user: data});
			}.bind(this),
			error: function (xhr, status, error) {
				console.error('/api/users', status, error.toString());
			}.bind(this)
		});
	},
	
	getInitialState: function () {
		return {
			data: {},
			formState: 2,
			user: {}
		};
	},
	
	componentDidMount: function () {
		var currPost = window.location.pathname.substr(1);
		
		this.loadComments();
		this.loadUser();
		setInterval(this.loadComments, this.props.pollInterval);
		setInterval(this.loadUser, this.props.pollInterval);
		if (window.location.hash.length >= 9) {
			setTimeout(function () {window.location.href = currPost + "#comment-" + window.location.hash.substr(9)}, 500);
		}
	},
	
	handleCommentSubmit: function (comment, url) {
		var currPost = window.location.pathname.substr(1);
		$.ajax({
			url: '/api/comments',
			json: true,
			type: 'POST',
			data: JSON.stringify({comment: comment, url: url.join('/'), currPost: currPost}),
    		contentType: "application/json",
			success: function () {
			}.bind(this),
			error: function (xhr, status, error) {
				console.error('/api/comments/', status, error.toString());
			}.bind(this)
		});
	},
	
	handleVoteSubmit: function (id, url, type, container) {
		var currComponent = this;
		var currPost = window.location.pathname.substr(1);
		$.ajax({
			url: '/api/votes',
			json: true,
			type: 'POST',
			data: JSON.stringify(
				{
					id: id, 
					url: url.join('/'),
					type: type,
					user: this.state.user.name,
					currPost: currPost,
					container: container
				}),
    		contentType: "application/json",
			success: function () {
				currComponent.loadUser();
			}.bind(this),
			error: function (xhr, status, error) {
				console.error('/api/votes', status, error.toString());
			}.bind(this)
		});
	},
	
	render: function () {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList 
					onCommentSubmit={this.handleCommentSubmit} 
					onVoteSubmit={this.handleVoteSubmit}
					data={this.state.data} 
					user={this.state.user}/>
				<CommentForm
					onCommentSubmit={this.handleCommentSubmit} 
					formState={this.state.formState} 
					user={this.state.user}/>
			</div>
		);
	}
});