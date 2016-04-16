var React = require('react');
var $ = require('jquery');

var Error = require('./error.jsx');
var RegisterForm = require('./registerForm.jsx');
var LoginForm = require('./loginForm.jsx');

module.exports = React.createClass({
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