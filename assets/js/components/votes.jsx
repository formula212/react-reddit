var React = require('react');

module.exports = React.createClass({
	getVote: function () {
		var voteVal = 0;
		if (this.props.user.val && this.props.user.val.votes && this.props.data.id in this.props.user.val.votes)
			voteVal = this.props.user.val.votes[this.props.data.id];
		return voteVal;
	},
	
	handleUpVote: function (e) {
		e.preventDefault();
		if (!this.props.user.name) {
			alert("You are not logged in");
			return;
		}
		this.props.onVoteSubmit(null, [], 1);
	},
	
	handleDownVote: function (e) {
		e.preventDefault();
		if (!this.props.user.name) {
			alert("You are not logged in");
			return;
		}
		this.props.onVoteSubmit(null, [], -1);
	},
	
	render: function () {
		var vote = this.getVote();
		return (
			<div className="votes">
				<a href="" onClick={this.handleUpVote} className={vote == 1 ? "active" : ""}>
					<i className="fa fa-chevron-up"></i>
				</a>
				<div>{this.props.data.votes}</div>
				<a href="" onClick={this.handleDownVote} className={vote == -1 ? "active" : ""}>	
					<i className="fa fa-chevron-down"></i>
				</a>
			</div>
		);
	}
});