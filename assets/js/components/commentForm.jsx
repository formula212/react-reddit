var React = require('react');

var Comment = require('./error.jsx');

module.exports = React.createClass({
	getInitialState: function () {
		return {
			title: '',
			text: '',
			message: ''
		}
	},
	
	handleTitleChange: function (e) {
		this.setState({title: e.target.value});
	},
	
	handleTextChange: function (e) {
		this.setState({text: e.target.value});
	},
	
	handleSubmit: function (e) {
		e.preventDefault();
		var title = this.state.title.trim();
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
			
		this.props.onCommentSubmit({
			author: this.props.user.name,
			title: title, 
			text: text, 
			date: Date(),
			votes: 0
		}, []);
		
		this.setState({title: '', text: '', message: ''});
	},
	
	render: function () {
		if (this.props.formState)
			return (
				<div>
					<form className="commentForm" onSubmit={this.handleSubmit}>
						<input 
							type="text" 
							placeholder="Title"
							value={this.state.title}
							onChange={this.handleTitleChange}
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
		else
			return (<noscript/>);
	}
});