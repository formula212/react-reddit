var React = require('react');
var marked = require('marked');

var Votes = require('./votes.jsx');
var CommentForm = require('./commentForm.jsx');
var CommentList = require('./commentList.jsx');

var options = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
}

module.exports = React.createClass({
	contextTypes: {
		activeComment: React.PropTypes.string,
		root: React.PropTypes.object
	},
	
	getInitialState: function () {
		return {
			formState: 0,
		}
	},
	
	toggleForm: function (event) {
		this.setState({
			formState: (this.state.formState + 1) % 2
		});
	},
	
	rawMarkup: function () {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return {__html: rawMarkup};
	},
	
	handleCommentSubmit: function (comment, url) {
		if (this.state.formState == 1)
			this.toggleForm();
		url.unshift('child');
		url.unshift(this.props.data.id);
		this.props.onCommentSubmit(comment, url);
	},
	
	setActive: function () {
		this.context.activeComment = this.props.data.id;
		this.context.root.forceUpdate();
		window.location.href = "/#comment-" + this.props.data.id;
	},
	
	handleVoteSubmit: function (id, url, type) {
		if (id == null) {
			id = this.props.data.id;
		} else {
			url.unshift('child');
		}
		url.unshift(this.props.data.id);
		this.props.onVoteSubmit(id, url, type);
	},
	
	render: function () {
		return (
			<div className={"comment " + (this.context.activeComment != "" && this.context.activeComment == this.props.data.id ? "active" : "")} id={"comment-"+this.props.data.id}>
				<Votes 
					data={this.props.data}
					user={this.props.user}
					onVoteSubmit={this.handleVoteSubmit}/>
				<div className="header">
					<div className="commentAuthor">{this.props.data.author}</div>
					<div className="date">&nbsp;on {new Date(this.props.data.date).toLocaleDateString("en-US", options)}</div>
					<div className="title">&nbsp;{this.props.data.title}</div>
				</div>
				
				<div className="commentBody" dangerouslySetInnerHTML={this.rawMarkup()}/>
				
				
				<a className="link" onClick={this.toggleForm}>Reply</a>
				<a className="link" onClick={this.setActive}>Permalink</a>
				
				<CommentForm 
					onCommentSubmit={this.handleCommentSubmit} 
					formState={this.state.formState}
					user={this.props.user}/>
				<CommentList 
					data={this.props.data.child} 
					onCommentSubmit={this.handleCommentSubmit}
					onVoteSubmit={this.handleVoteSubmit}
					user={this.props.user}/>
			</div>
		);
	}
});