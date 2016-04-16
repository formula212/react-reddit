var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');
var Votes = require('./assets/js/components/votes.jsx');
var CommentBox = require('./assets/js/components/commentBox.jsx');
var Comment = require('./assets/js/components/comment.jsx');
var Error = require('./assets/js/components/error.jsx');

console.log(Votes);
console.log(CommentBox);
console.log(Comment);

var options = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};
		
var LoginForm = React.createClass({
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
		
var RegisterForm = React.createClass({
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

var UserForm = React.createClass({
	getInitialState: function () {
		return {
			user: {},
			error: ''
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
	
	componentDidMount: function () {
		this.loadUser();
	},
	
	handleError: function (message) {
		this.setState({error: message});
	},
	
	handleLogin: function (username, password) {
		var component = this;
		$.ajax({
			url: '/api/users/login',
			json: true,
			type: 'POST',
			data: JSON.stringify({username: username, password: password}),
    		contentType: "application/json",
			success: function () {
				component.loadUser();
			}.bind(this),
			error: function (xhr, status, error) {
				component.handleError(xhr.responseText);
				console.error('/api/users/login', status, error.toString());
			}.bind(this)
		});
	},
	
	handleRegister: function (username, password, email) {
		var component = this;
		$.ajax({
			url: '/api/users/register',
			json: true,
			type: 'POST',
			data: JSON.stringify({username: username, password: password, email: email}),
    		contentType: "application/json",
			success: function () {
				component.loadUser();
			}.bind(this),
			error: function (xhr, status, error) {
				component.handleError(xhr.responseText);
				console.error('/api/users/register', status, error.toString());
			}.bind(this)
		});
	},
	
	handleLogout: function (e) {
		e.preventDefault();
		var component = this;
		$.ajax({
			url: '/api/users/logout',
			json: true,
			type: 'POST',
    		contentType: "application/json",
			success: function () {
				component.loadUser();
			}.bind(this),
			error: function (xhr, status, error) {
				component.handleError(xhr.responseText);
				console.error('/api/users/register', status, error.toString());
			}.bind(this)
		});
	},
	
	render: function () {
		if (!this.state.user.name) {
			return (
				<div>
					<LoginForm handleError={this.handleError} handleLogin={this.handleLogin}/>
					<RegisterForm handleError={this.handleError} handleRegister={this.handleRegister}/>
					<Error message={this.state.error}/>
				</div>
			);
		} else {
			return (
				<div>
					<h1>Hello {this.state.user['name']}</h1>
					<form className="logout" onSubmit={this.handleLogout}>
						<input type="submit" value="Logout"/>
					</form>
				</div>
			);
		}
	}
});

ReactDOM.render(
	<UserForm/>,
	document.getElementById('userform')
);
/*
ReactDOM.render(
	<CommentBox pollInterval={2000}/>,
	document.getElementById('content')
);*/