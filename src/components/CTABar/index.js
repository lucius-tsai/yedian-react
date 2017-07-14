import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ctabar.scss';

import { likeMessage, delLikeMessage, favoriteMessage, delFavoriteMessage, commentMessage } from '../../libs/api';

export default class CTABar extends Component {
	constructor(props) {
		super(props);
		this.like = this.like.bind(this);
		this.favorite = this.favorite.bind(this);
		this.comment = this.comment.bind(this);
	}

	componentWillMount() {
	}

	like() {
		const { post } = this.props;
		likeMessage({
			type: 'POST',
			targetId: post._id
		}).then(res => {

		}, error => {

		});
		alert('like')
	}

	favorite() {
		alert('favorite')
		const { post } = this.props;
		favoriteMessage({
			type: 'POST',
			targetId: post._id
		}).then(res => {

		}, error => {

		});
		
	}

	comment() {
		alert('comment');
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
					<div className="icon ion-cta-collection" onClick={this.favorite}>&nbsp;</div>
					<span className="text">{post.favoriteCount}</span>
				</div>
				<div className="cell _comment">
					{
						fix ? <Link className="icon ion-cta-comment" to={{ pathname: `${BASENAME}message/${post._id}`, state: { id: post._id }}}>&nbsp;</Link>
						: <div className="icon ion-cta-comment" onClick={this.comment}>&nbsp;</div>
					}
					
					<span className="text">{post.comentCount}</span>
				</div>
			</div>
		)
	}
	componentWillUnmount() {
	}
}