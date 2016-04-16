var React = require('react');
var marked = require('marked');

var options = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
}

module.export = React.createClass({
	rawMarkup: function () {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return {__html: rawMarkup};
	},

	render: function () {
		return (
			<div className="post">
				<div className="header">
					<div className="commentAuthor">{this.props.data.author}</div>
					<div className="date">&nbsp;on {new Date(this.props.data.date).toLocaleDateString("en-US", options)}</div>
					<div className="title">&nbsp;{this.props.data.title}</div>
				</div>
				
				<div className="commentBody" dangerouslySetInnerHTML={this.rawMarkup()}/>
			</div>
		);
	}
});