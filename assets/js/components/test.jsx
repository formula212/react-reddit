var React = require('react');
var Error = require('./error.jsx');

module.exports = React.createClass({
	render: function () {
		return (
			<Error message={'this is an error message'}/>
		);
	}
});