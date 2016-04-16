var React = require('react');

module.exports = React.createClass({
	getInitialState: function () {
		return {
			username: '',
			password: '',
			error: '',
		}
	},
	
	handleUsernameChange: function (e) {
		this.setState({username: e.target.value});
	},
	
	handlePasswordChange: function (e) {
		this.setState({password: e.target.value});
	},
	
	handleSubmit: function (e) {
		e.preventDefault();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		
		// validation
		if (!username) {
			this.props.handleError("Username cannot be empty");
			return;
		}
		
		if (!password) {
			this.props.handleError("Password cannot be empty");
			return;
		}

		this.props.handleLogin(username, password);
		
		this.setState({username: '', password: ''});
	},
	
	render: function () {
		return (
			<form className="login" onSubmit={this.handleSubmit}>
				<input 
					type="text" 
					placeholder="username"
					value={this.state.username}
					onChange={this.handleUsernameChange}
				/><br/>
				<input 
					type="password" 
					placeholder="password"
					value={this.state.password}
					onChange={this.handlePasswordChange}
				/><br/>
				<input type="submit" value="Login"/>
			</form>
		);
	}
});