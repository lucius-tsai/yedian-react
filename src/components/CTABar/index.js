import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ctabar.scss';

import { getLikes, likeMessage, delLikeMessage, getFavorites, favoriteMessage, delFavoriteMessage, commentMessage } from '../../libs/api';

export default class CTABar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showComment: false
		}
		this.like = this.like.bind(this);
		this.favorite = this.favorite.bind(this);
		this.comment = this.comment.bind(this);
		this.openComment = this.openComment.bind(this);
	}

	componentWillMount() {
		const { post } = this.props;
		getLikes(post._id).then(res => {
			console.log(res);
		}, error => {
			console.log(error);
		});
		getFavorites(post._id).then(res => {
			console.log(res);
		}, error => {
			console.log(error);
		});
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
		alert('favorite');
		const { post } = this.props;
		favoriteMessage({
			type: 'POST',
			targetId: post._id
		}).then(res => {
		}, error => {
		});
	}

	openComment() {
		this.setState({
			showComment: true
		});
		// alert('comment');
	}
	comment() {
		this.setState({
			showComment: false
		});
	}

	render() {
		const { showComment } = this.state;
		const { fix, post } = this.props;
		
		let catBarClass = 'cta-box';

		if(fix) {
			catBarClass = `${catBarClass} clearfix`;
		} else {
			catBarClass = `${catBarClass} fix`;
		}

		return (
			<div>
				<div className={showComment ? `${catBarClass} bar-hidden` : catBarClass}>
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
							: <div className="icon ion-cta-comment" onClick={this.openComment}>&nbsp;</div>
						}
						<span className="text">{post.comentCount}</span>
					</div>
				</div>
				<div className={ showComment ? 'comment-box': 'comment-box bar-hidden' }>
					<textarea className='comment-txt' placeholder='我也要留下一评'></textarea>
					<button className='comment-btn' onClick={this.comment}>提交</button>
				</div>
			</div>
		)
	}
	componentWillUnmount() {
	}
}