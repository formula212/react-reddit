var React = require('react');
var marked = require('marked');
var $ = require('jquery');

var PostForm = require('./postForm.jsx');
var Votes = require('./votes.jsx');

var options = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
}

var Post = React.createClass({
	rawMarkup: function () {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return {__html: rawMarkup};
	},
	
	handleVoteSubmit: function (id, url, type, component) {
		id = this.props.data.id;
		this.props.onVoteSubmit(id, url, type, component);
	},

	render: function () {
		return (
			<div className="post">
				<Votes 
					data={this.props.data}
					user={this.props.user}
					onVoteSubmit={this.handleVoteSubmit}
					type='post'/>
			
				<a href={this.props.data.link} className="title">{this.props.data.title}</a>
				<div className="subtitle">
					<div className="date">Submitted on {new Date(this.props.data.date).toLocaleDateString("en-US", options)}</div>
					<div className="postAuthor">&nbsp;by {this.props.data.author}</div>
				</div>
				
				<div className="postBody" dangerouslySetInnerHTML={this.rawMarkup()}/>
				<div className="postFooter">
					<a href={"/" + this.props.data.id}>Read comments</a>
				</div>
			</div>
		);
	}
});

module.exports = React.createClass({
	getInitialState: function () {
		return {
			data: {},
			user: {}
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
		$.ajax({
			url: '/api/posts',
			dataType: 'json',
			cache: false,
			success: function (data) {
				this.setState({data: data['posts']});
			}.bind(this),
			error: function (xhr, status, error) {
				console.error('/api/posts', status, error.toString());
			}.bind(this)
		});
	},
	
	componentDidMount: function () {
		this.loadPosts();
		this.loadUser();
		setInterval(this.loadPosts, this.props.pollInterval);
		setInterval(this.loadUser, this.props.pollInterval);
	},
	
	handlePostSubmit: function (post) {
		$.ajax({
			url: '/api/posts',
			json: true,
			type: 'POST',
			data: JSON.stringify({post: post}),
    		contentType: "application/json",
			success: function () {
			}.bind(this),
			error: function (xhr, status, error) {
				console.error('/api/posts', status, error.toString());
			}.bind(this)
		});
	},
	
	handleVoteSubmit: function (id, url, type, container) {
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
				console.error('/api/votes', status, error.toString());
			}.bind(this)
		});
	},
	
	render: function () {
		var posts = this.state.data;
		var currComponent = this;
		
		var postNodes = Object.keys(posts).map(function (key) {
			return (
				<Post
					key={posts[key].id} 
					data={posts[key]} 
					user={currComponent.state.user}
					onVoteSubmit={currComponent.handleVoteSubmit}>
					{posts[key].text}
				</Post>
			);
		});
		
		return (
			<div>
				<PostForm 
					onPostSubmit={this.handlePostSubmit}
					user={this.state.user}/>
				{postNodes}
			</div>
		);
	}
});