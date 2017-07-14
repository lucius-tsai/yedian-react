import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './ctabar.scss';

import { getLikes, likeMessage, delLikeMessage, getFavorites, favoriteMessage, delFavoriteMessage, commentMessage } from '../../libs/api';

class CTABar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showComment: false,
			comment: '',
			showBtn: false,
			liked: false,
			likeID: null,
			favorited: false,
			favoriteID: null,
			likeCount: 0,
			favoriteCount: 0,
			comentCount: 0
		}
		this.like = this.like.bind(this);
		this.favorite = this.favorite.bind(this);
		this.comment = this.comment.bind(this);
		this.openComment = this.openComment.bind(this);
		this.input = this.input.bind(this);
	}

	componentWillMount() {
		const { post, userInfo } = this.props;
		const userId = userInfo && userInfo.user ? userInfo.user.id : null;
		this.setState({
			likeCount: post.likeCount,
			favoriteCount: post.favoriteCount,
			comentCount: post.comentCount
		});
		getLikes({
			type: "POST",
			targetId: post._id
		}).then(res => {
			if (res.code === 200) {
				res.data.forEach(cell => {
					if (cell.userId === userId) {
						this.setState({
							liked: true,
							likeID: cell._id
						})
					}
				})
			}
		}, error => {
			console.log(error);
		});
		getFavorites({
			type: "POST",
			targetId: post._id
		}).then(res => {
			if (res.code === 200) {
				res.data.forEach(cell => {
					if (cell.userId === userId) {
						this.setState({
							favorited: true,
							favoriteID: cell._id
						})
					}
				})
			}
		}, error => {
			console.log(error);
		});
	}

	like() {
		const self = this;
		const { post } = this.props;
		if (this.state.liked) {
			delLikeMessage(this.state.likeID).then(res => {
				console.log(res);
				if (res.code === 200) {
					self.setState({
						liked: false,
						likeID: null,
						likeCount: (self.state.likeCount * 1 - 1)
					})
				}
			}, error => {

			});
		} else {
			likeMessage({
				type: 'POST',
				targetId: post._id
			}).then(res => {
				if (res.code === 200) {
					self.setState({
						liked: true,
						likeID: res.data._id,
						likeCount: (self.state.likeCount * 1 + 1)
					});
				}
			}, error => {

			});
		}
	}

	favorite() {
		const self = this;
		const { post } = this.props;
		if (this.state.favorited) {
			delFavoriteMessage(this.state.favoriteID).then(res => {
				if (res.code === 200) {
					self.setState({
						favorited: false,
						favoriteID: null,
						favoriteCount: (self.state.favoriteCount * 1 - 1)
					})
				}
			}, error => {

			});
		} else {
			favoriteMessage({
				type: 'POST',
				targetId: post._id
			}).then(res => {
				if (res.code === 200) {
					self.setState({
						favorited: true,
						favoriteID: res.data._id,
						favoriteCount: (self.state.favoriteCount*1+1)
					});
				}
			}, error => {
			});
		}
	}

	openComment() {
		this.setState({
			showComment: true
		});
		// alert('comment');
	}
	comment() {
		const { post, userInfo } = this.props;
		if (userInfo && userInfo.user && userInfo.user.id) {
			commentMessage({
				type: 'POST',
				targetId: post._id,
				userId: userInfo.user.id,
				isDisplay: true
			}).then(res => {
				this.setState({
					showComment: false
				});
			}, error => {

			});
		}

	}

	focus(ref) {
		if (ref) {
			ref.focus();
			document.body.scrollTop = document.body.clientHeight;
		}
	}

	input(e) {
		const input = e.target.value.trim();
		this.setState({
			comment: input,
			showBtn: !!input.length
		});
	}

	render() {
		const { showComment, showBtn, favorited, liked, likeCount, favoriteCount, comentCount } = this.state;
		const { fix, post } = this.props;

		let catBarClass = 'cta-box';

		if (fix) {
			catBarClass = `${catBarClass} clearfix`;
		} else {
			catBarClass = `${catBarClass} fix`;
		}

		return (
			<div>
				<div className={showComment ? `${catBarClass} bar-hidden` : catBarClass}>
					<div className="cell _like">
						<div className={liked ? "icon ion-cta-like active" : "icon ion-cta-like"} onClick={this.like}>&nbsp;</div>
						<span className="text">{likeCount}</span>
					</div>
					<div className="cell _collection">
						<div className={favorited ? "icon ion-cta-collection active" : "icon ion-cta-collection"} onClick={this.favorite}>&nbsp;</div>
						<span className="text">{favoriteCount}</span>
					</div>
					<div className="cell _comment">
						{
							fix ? <Link className="icon ion-cta-comment" to={{ pathname: `${BASENAME}message/${post._id}`, state: { id: post._id } }}>&nbsp;</Link>
								: <div className="icon ion-cta-comment" onClick={this.openComment}>&nbsp;</div>
						}
						<span className="text">{comentCount}</span>
					</div>
				</div>
				<div className={showComment ? 'comment-box' : 'comment-box bar-hidden'}>
					{
						showComment ?
							<textarea className={showBtn ? 'comment-txt' : 'comment-txt btn-hidden'} placeholder='我也要留下一评' ref={this.focus} onChange={this.input}></textarea>
							: ''
					}
					<button className={showBtn ? 'comment-btn' : 'comment-btn btn-hidden'} onClick={this.comment}>提交</button>
				</div>
			</div>
		)
	}

	componentDidUpdate() {
		const { showComment } = this.state;
		// if (showComment) {

		// 	document.body.setAttribute('class', 'no-scroll');
		// } else {
		// 	document.body.removeAttribute('class');
		// }
	}

	componentWillUnmount() {
	}
}


const mapStateToProps = state => {
	const { userInfo } = state;
	return {
		userInfo
	}
};

const mapDispatchToProps = (dispatch) => {
	return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(CTABar);