var React = require('react');
var marked = require('marked');
var $ = require('jquery');

var PostForm = require('./postForm.jsx');

var options = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
}

var Post = React.createClass({
	rawMarkup: function () {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return {__html: rawMarkup};
	},

	render: function () {
		return (
			<div className="post">
					
				<a href={this.props.data.link} className="title">{this.props.data.title}</a>
				<div className="subtitle">
					<div className="date">Submitted on {new Date(this.props.data.date).toLocaleDateString("en-US", options)}</div>
					<div className="postAuthor">&nbsp;by {this.props.data.author}</div>
				</div>
				
				<div className="postBody" dangerouslySetInnerHTML={this.rawMarkup()}/>
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
				console.log(data);
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
				console.error(this.props.url, status, error.toString());
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
				console.error(this.props.url, status, error.toString());
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
					user={currComponent.props.user}>
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