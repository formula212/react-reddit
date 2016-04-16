var React = require('react');
var marked = require('marked');
var $ = require('jquery');

var Votes = require('./votes.jsx');

var options = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
}

module.exports = React.createClass({
	getInitialState: function () {
		return {
			user: {},
			data: {}
		}
	},
	
	loadUser: function () {
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
	
	loadPosts: function () {
		var currPost = window.location.pathname.substr(1);
		$.ajax({
			url: '/api/posts/' + currPost,
			dataType: 'json',
			cache: false,
			success: function (data) {
				this.setState({data: data['post']});
			}.bind(this),
			error: function (xhr, status, error) {
				console.error('/api/posts/' + currPost, status, error.toString());
			}.bind(this)
		});
	},
	
	componentDidMount: function () {
		this.loadPosts();
		this.loadUser();
		setInterval(this.loadPosts, this.props.pollInterval);
		setInterval(this.loadUser, this.props.pollInterval);
	},
	
	rawMarkup: function () {
		var text = '';
		if (this.state.data.text)
			text = this.state.data.text;
		var rawMarkup = marked(text, {sanitize: true});
		return {__html: rawMarkup};
	},
	
	handleVoteSubmit: function (id, url, type, container) {
		id = this.state.data.id;
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
					user: this.state.user.name,
					currPost: '',
					container: container
				}),
    		contentType: "application/json",
			success: function () {
				currComponent.loadUser();
			}.bind(this),
			error: function (xhr, status, error) {
				console.error('/api/posts/' + currPost, status, error.toString());
			}.bind(this)
		});
	},

	render: function () {
		return (
			<div className="post">
				<Votes 
					data={this.state.data}
					user={this.state.user}
					onVoteSubmit={this.handleVoteSubmit}
					type='post'/>
			
				<a href={this.state.data.link} className="title">{this.state.data.title}</a>
				<div className="subtitle">
					<div className="date">Submitted on {new Date(this.state.data.date).toLocaleDateString("en-US", options)}</div>
					<div className="postAuthor">&nbsp;by {this.state.data.author}</div>
				</div>
				
				<div className="postBody" dangerouslySetInnerHTML={this.rawMarkup()}/>
				<div className="postFooter">
					<a href={"/" + this.state.data.id}>Read comments</a>
				</div>
			</div>
		);
	}
});