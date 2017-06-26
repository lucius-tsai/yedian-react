import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './message.scss';

export default class Carousel extends Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
	}
	componentWillUnmount() {
	}
	render() {
		return (
			<div className="card-message">
				<div className="">
					<Avator />
					<button>关注</button>
				</div>
			</div>
		)
	}
}