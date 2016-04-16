var React = require('react');

var Error = require('./error.jsx');

module.exports = React.createClass({
	getInitialState: function () {
		return {
			title: '',
			text: '',
			link: '',
			message: ''
		}
	},
	
	handleTitleChange: function (e) {
		this.setState({title: e.target.value});
	},
	
	handleLinkChange: function (e) {
		this.setState({link: e.target.value});
	},
	
	handleTextChange: function (e) {
		this.setState({text: e.target.value});
	},
	
	handleSubmit: function (e) {
		e.preventDefault();
		var title = this.state.title.trim();
		var link = this.state.link.trim();
		var text = this.state.text.trim();
		
		// validation
		if (!title) {
			this.setState({message: 'Title cannot be empty'});
			return;
		}
		
		if (!text) {
			this.setState({message: 'Text cannot be empty'});
			return;
		}

		if (!this.props.user.name) {
			this.setState({message: 'You are not logged in'});
			return;
		}
			
		this.props.onPostSubmit({
			author: this.props.user.name,
			title: title, 
			link: link,
			text: text, 
			date: Date(),
			votes: 0
		});
		
		this.setState({title: '', text: '', message: '', link: ''});
	},
	
	render: function () {
		return (
			<div>
				<form className="postForm" onSubmit={this.handleSubmit}>
					<input 
						type="text" 
						placeholder="Title"
						value={this.state.title}
						onChange={this.handleTitleChange}
					/><br/>
					<input 
						type="text" 
						placeholder="Link"
						value={this.state.link}
						onChange={this.handleLinkChange}
					/><br/>
					<textarea 
						type="text" 
						placeholder="Comment here..."
						value={this.state.text}
						onChange={this.handleTextChange}
					/><br/>
					<input type="submit" value="Post"/>
				</form>
				<Error message={this.state.message}/>
			</div>
		);
	}
});