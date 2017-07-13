import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ctabar.scss';

import { likeMessage } from '../../libs/api';

export default class CTABar extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
	}

	like() {
		
	}

	render() {
		const { fix, post } = this.props;
		
		return (
			<div className={fix ? "cta-box clearfix" : "cta-box fix"}>
				<div className="cell _like">
					<div className="icon ion-cta-like" onClick={this.like}>&nbsp;</div>
					<span className="text">{post.likeCount}</span>
				</div>
				<div className="cell _collection">
					<div className="icon ion-cta-collection">&nbsp;</div>
					<span className="text">{post.favoriteCount}</span>
				</div>
				<div className="cell _comment">
					<div className="icon ion-cta-comment">&nbsp;</div>
					<span className="text">{post.comentCount}</span>
				</div>
			</div>
		)
	}
	componentWillUnmount() {
	}
}