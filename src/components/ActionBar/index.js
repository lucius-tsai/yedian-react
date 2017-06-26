/**
 * Created by townmi on 17/6/4.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './actionBar.scss';

export default class ActionBar extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { position } = this.props;
		const cellWidth = window.innerWidth > 414 ? 414 / 2 : window.innerWidth / 2;
		return (
			<Link className={position === "bottom" ? "action-bar bottom" : "action-bar"} to={{ pathname: `${BASENAME}publish`, state: { test: false } }} style={{ transform: `translateX(calc(${cellWidth}px - 140%))` }}>
				<div className="icon ion-pencil"></div>
			</Link>
		)
	}
}