var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');

var CommentBox = require('./assets/js/components/commentBox.jsx');
var UserForm = require('./assets/js/components/userForm.jsx');
var Home = require('./assets/js/components/home.jsx');


ReactDOM.render(
	<Home pollInterval={2000}/>,
	document.getElementById('home')
);

ReactDOM.render(
	<UserForm/>,
	document.getElementById('userform')
);
ReactDOM.render(
	<CommentBox pollInterval={2000}/>,
	document.getElementById('content')
);
/*
ReactDOM.render(
	<CommentBox pollInterval={2000}/>,
	document.getElementById('content')
);*/