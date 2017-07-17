import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './ctabar.scss';

import {
	getLikes,
	likeMessage,
	delLikeMessage,
	getFavorites,
	favoriteMessage,
	delFavoriteMessage
} from '../../libs/api';

import { showComment, hiddenComment } from '../../store/actions/appStatus';

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
			commentCount: 0
		}
		this.like = this.like.bind(this);
		this.favorite = this.favorite.bind(this);
		this.openComment = this.openComment.bind(this);
		this.__hidden = this.__hidden.bind(this);
	}

	componentWillMount() {
		const { post, userInfo, showComment } = this.props;
		const userId = userInfo && userInfo.user ? userInfo.user.id : null;
		this.setState({
			likeCount: post.likeCount,
			favoriteCount: post.favoriteCount,
			commentCount: post.commentCount,
			showComment
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

	componentWillReceiveProps(nextProps) {
		const { showComment } = nextProps;
		this.setState({ showComment });
	}

	like() {
		const self = this;
		const { post } = this.props;
		if (this.state.liked) {
			delLikeMessage(this.state.likeID).then(res => {
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
						favoriteCount: (self.state.favoriteCount * 1 + 1)
					});
				}
			}, error => {
			});
		}
	}

	openComment() {
		const { __showComment } = this.props;
		__showComment();
	}

	__hidden(e) {
		const { __hiddenComment } = this.props;
		__hiddenComment();
	}

	handleClick(ref) {
		const className = ref && ref.className;
		ref && ref.addEventListener && ref.addEventListener('click', (e) => {
			ref.className = `${ref.className} bounceIn animated`;
			setTimeout(() => {
				ref.className = className;
			}, 400);
		});
	}

	render() {
		const { showComment, favorited, liked, likeCount, favoriteCount, commentCount } = this.state;
		const { fix, post } = this.props;

		let catBarClass = 'cta-box';

		if (fix) {
			catBarClass = `${catBarClass} clearfix`;
		} else {
			catBarClass = `${catBarClass} fix`;
		}

		return (
			<div onClick={e => { e.nativeEvent.stopImmediatePropagation(); }}>
				<div className={showComment ? `${catBarClass} bar-hidden` : catBarClass}>
					<div className={liked ? "cell _like active" : "cell _like"}>
						<div className="icon ion-cta-like" onClick={this.like} ref={this.handleClick}>&nbsp;</div>
						<span className="text" style={{width: `${String(likeCount).length * 10}px`}}>{likeCount}</span>
					</div>
					<div className={favorited ? "cell _collection active" : "cell _collection"}>
						<div className="icon ion-cta-collection" onClick={this.favorite} ref={this.handleClick}>&nbsp;</div>
						<span className="text" style={{width: `${String(favoriteCount).length * 10}px`}}>{favoriteCount}</span>
					</div>
					<div className="cell _comment">
						{
							fix ? <Link className="icon ion-cta-comment" to={{ pathname: `${BASENAME}message/${post._id}`, state: { id: post._id } }}>&nbsp;</Link>
								: <div className="icon ion-cta-comment" onClick={this.openComment}>&nbsp;</div>
						}
						<span className="text">{commentCount}</span>
					</div>
				</div>
			</div>
		)
	}
	
	componentDidUpdate() {
		const { showComment } = this.props;
		if(showComment) {
			document.addEventListener('click', this.__hidden);
		}
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.__hidden);
	}
}


const mapStateToProps = state => {
	const { userInfo, appStatus } = state;
	return {
		userInfo,
		showComment: appStatus.showComment || false
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		__showComment: (cell) => {
			dispatch(showComment(cell));
		},
		__hiddenComment: (cell) => {
			dispatch(hiddenComment(cell));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CTABar);