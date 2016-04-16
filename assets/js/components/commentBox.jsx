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
		$.ajax({
			url: '/api/comments',
			dataType: 'json',
			cache: false,
			success: function (data) {
				this.setState({data: data['comments']});
			if (window.location.hash.length >= 9)
				window.location.href = "/#comment-" + window.location.hash.substr(9);
			}.bind(this),
			error: function (xhr, status, error) {
				console.error(this.props.url, status, error.toString());
			}.bind(this)
		});
	},
	
	loadUser: function () {
		$.ajax({
			url: '/api/users',
			dataType: 'json',
			cache: false,
			success: function (data) {
				this.setState({user: data});
				console.log(data);
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
			user: ''
		};
	},
	
	componentDidMount: function () {
		if (window.location.hash.length >= 9)
			window.location.href = "/#comment-" + window.location.hash.substr(9);
		this.loadComments();
		this.loadUser();
		setInterval(this.loadComments, this.props.pollInterval);
		setInterval(this.loadUser, this.props.pollInterval);
	},
	
	handleCommentSubmit: function (comment, url) {
		$.ajax({
			url: '/api/comments',
			json: true,
			type: 'POST',
			data: JSON.stringify({comment: comment, url: url.join('/')}),
    		contentType: "application/json",
			success: function () {
			}.bind(this),
			error: function (xhr, status, error) {
				console.error(this.props.url, status, error.toString());
			}.bind(this)
		});
	},
	
	handleVoteSubmit: function (id, url, type) {
		var currComponent = this;
		$.ajax({
			url: '/api/votes',
			json: true,
			type: 'POST',
			data: JSON.stringify(
				{
					id: id, 
					url: url.join('/'),
					type: type,
					user: this.state.user.name
				}),
    		contentType: "application/json",
			success: function () {
				currComponent.loadUser();
			}.bind(this),
			error: function (xhr, status, error) {
				console.error(this.props.url, status, error.toString());
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