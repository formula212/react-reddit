var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');

var CommentBox = require('./assets/js/components/commentBox.jsx');
var UserForm = require('./assets/js/components/userForm.jsx');
var Home = require('./assets/js/components/home.jsx');
var PagePost = require('./assets/js/components/pagePost.jsx');

if (document.getElementById('home') != null)
	ReactDOM.render(
		<Home pollInterval={2000}/>,
		document.getElementById('home')
	);

if (document.getElementById('userform') != null)
	ReactDOM.render(
		<UserForm/>,
		document.getElementById('userform')
	);

if (document.getElementById('comments') != null)
	ReactDOM.render(
		<CommentBox pollInterval={2000}/>,
		document.getElementById('comments')
	);

if (document.getElementById('post') != null)
	ReactDOM.render(
		<PagePost pollInterval={2000}/>,
		document.getElementById('post')
	);