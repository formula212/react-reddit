var React = require('react');

module.exports = React.createClass({
	getInitialState: function () {
		return {
			username: '',
			password1: '',
			password2: '',
			email: '',
			error: ''
		}
	},
	
	handleUsernameChange: function (e) {
		this.setState({username: e.target.value});
	},
	
	handlePasswordChange1: function (e) {
		this.setState({password1: e.target.value});
	},
	
	handlePasswordChange2: function (e) {
		this.setState({password2: e.target.value});
	},
	
	handleEmailChange: function (e) {
		this.setState({email: e.target.value});
	},
	
	handleSubmit: function (e) {
		e.preventDefault();
		var username = this.state.username.trim();
		var password1 = this.state.password1.trim();
		var password2 = this.state.password2.trim();
		var email = this.state.email.trim();
		
		// validation
		if (!username) {
			this.props.handleError("Username cannot be empty");
			return;
		}
		
		if (!email) {
			this.props.handleError("Email cannot be empty");
			return;
		}
		
		if (!password1 || !password2) {
			this.props.handleError("Password cannot be empty");
			return;
		}
		
		if (password1 != password2) {
			this.props.handleError("Passwords do not match");
			return;
		}
		
		this.props.handleRegister(username, password1, email);
		
		this.setState({username: '', password1: '', password2: '', email: ''});
	},
	
	render: function () {
		return (
			<form className="register" onSubmit={this.handleSubmit}>
				<input 
					type="text" 
					placeholder="username"
					value={this.state.username}
					onChange={this.handleUsernameChange}
				/><br/>
				<input 
					type="text" 
					placeholder="email"
					value={this.state.email}
					onChange={this.handleEmailChange}
				/><br/>
				<input 
					type="password" 
					placeholder="password"
					value={this.state.password1}
					onChange={this.handlePasswordChange1}
				/><br/>
				<input 
					type="password" 
					placeholder="password"
					value={this.state.password2}
					onChange={this.handlePasswordChange2}
				/><br/>
				<input type="submit" value="Register"/>
			</form>
		);
	}
});
