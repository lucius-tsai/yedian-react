import React, { Component } from 'react';
import { connect } from 'react-redux';

import './login.scss';

import { hideBar, showBar } from '../../store/actions/appStatus';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			account: {
				email: "test.test.com",
				password: "123456"
			}
		}
	}

	componentWillMount() {
		const self = this;
		const { hideBar } = this.props;
		hideBar();
	}

	submit(event) {
		event.preventDefault();
		let { auth } = this.props.authData;
		auth(this.state.account, this.props.history);
	}
	render() {
		return (
			<div className="login">

			</div>
		)
	}
	componentWillUnmount() {
    const {showBar} = this.props;
    showBar(); 
  }
}

const mapStateToProps = state => {
	const { appStatus, router } = state;
	return {
		router
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		hideBar: () => {
			dispatch(hideBar())
		},
		showBar: () => {
			dispatch(showBar())
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);