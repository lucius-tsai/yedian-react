/**
 * Created by townmi on 17/6/4.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './actionBar.scss';

export default class ActionBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: this.props.tags
		}
	}

  componentWillReceiveProps(nextProps) {
    const { tags } = nextProps;
    this.setState({
      tags: tags
    });
  }
	render() {
		const { position } = this.props;
		const { tags } = this.state;
		const cellWidth = window.innerWidth > 414 ? 414 / 2 : window.innerWidth / 2;
		return (
			<Link className={position === "bottom" ? "action-bar bottom" : "action-bar"} to={{ pathname: `${BASENAME}publish`, state: { tags } }} style={{ transform: `translateX(calc(${cellWidth}px - 140%))` }}>
				<div className="icon ion-pencil"></div>
			</Link>
		)
	}
}