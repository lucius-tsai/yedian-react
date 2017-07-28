import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
	getLikes,
	likeMessage,
	delLikeMessage,
	getFavorites,
	favoriteMessage,
	delFavoriteMessage,
	deletePost
} from '../../libs/api';
import { os } from '../../libs/uitls';

import styles from './ctabar.scss';
import styleIcons from "../../icons/scss/ionicons";
import styleAnimate from "../../assets/scss/animate";
import styleBase from "../../assets/scss/base";

class CTABar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showComment: false,
			// liked: false,
			likeId: null,
			// favorited: false,
			favoriteId: null,
			likeCount: 0,
			favoriteCount: 0,
			commentCount: 0,
      isSelf: false,
		}
		this.like = this.like.bind(this);
		this.favorite = this.favorite.bind(this);
	}

	componentWillMount() {
		const { post, showComment, userInfo } = this.props;
		this.setState({
			likeCount: post.likeCount,
			favoriteCount: post.favoriteCount,
			commentCount: post.commentCount,
			showComment,
			likeId: post.likeId,
			favoriteId: post.favoriteId,
			isSelf: userInfo && userInfo.user && userInfo.user.id && userInfo.user.id === post.postedBy._id
		});
	}

	componentWillReceiveProps(nextProps) {
		const { showComment, userInfo, post } = nextProps;
		this.setState({
			likeCount: post.likeCount,
			favoriteCount: post.favoriteCount,
			commentCount: post.commentCount,
			showComment,
			likeId: post.likeId,
			favoriteId: post.favoriteId,
			isSelf: userInfo && userInfo.user && userInfo.user.id && userInfo.user.id === post.postedBy._id
		});
	}

	like() {
		const self = this;
		const { post } = this.props;
		if (this.state.likeId) {
			delLikeMessage(this.state.likeId).then(res => {
				if (res.code === 200) {
					self.setState({
						// liked: false,
						likeId: null,
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
						// liked: true,
						likeId: res.data._id,
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
		if (this.state.favoriteId) {
			delFavoriteMessage(this.state.favoriteId).then(res => {
				if (res.code === 200) {
					self.setState({
						// favorited: false,
						favoriteId: null,
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
						// favorited: true,
						favoriteId: res.data._id,
						favoriteCount: (self.state.favoriteCount * 1 + 1)
					});
				}
			}, error => {
			});
		}
	}

	handleClick(ref) {
		const className = ref && ref.className;
		ref && ref.addEventListener && ref.addEventListener('click', (e) => {
			ref.className = `${ref.className} ${styleAnimate.bounceIn} ${styleAnimate.animated}`;
			setTimeout(() => {
				ref.className = className;
			}, 300);
		}, false);
	}

	render() {
		const { showComment, favoriteId, likeId, likeCount, favoriteCount, commentCount, isSelf } = this.state;
		const { fix, post } = this.props;

		let catBarClass = 'cta-box';

		if (fix) {
			catBarClass = `${styles[catBarClass]} ${styleBase['clearfix']}`;
		} else {
			catBarClass = `${styles[catBarClass]} ${styles['fix']}`;
		}

		return (
			<div onClick={e => { e.nativeEvent.stopImmediatePropagation(); }}>
				<div className={showComment ? `${catBarClass} ${styles['bar-hidden']}` : catBarClass}>
					<div className={likeId ? `${styles['cell']} ${styles['_like']} ${styles['active']}` : `${styles['cell']} ${styles['_like']}`}>
						<div data-icon className={styleIcons['ion-cta-like']} onClick={this.like} ref={this.handleClick}>&nbsp;</div>
						<span className={styles["text"]} style={{width: `${String(likeCount).length * 10}px`}}>{likeCount}</span>
					</div>
					<div className={favoriteId ? `${styles['cell']} ${styles['_collection']} ${styles['active']}` : `${styles['cell']} ${styles['_collection']}`}>
						<div data-icon className={styleIcons['ion-cta-collection']} onClick={this.favorite} ref={this.handleClick}>&nbsp;</div>
						<span className={styles["text"]} style={{width: `${String(favoriteCount).length * 10}px`}}>{favoriteCount}</span>
					</div>
					<div className={`${styles['cell']} ${styles['_comment']}`}>
						<Link data-icon className={styleIcons['ion-cta-comment']} to={{ pathname: `${BASENAME}comment`, search: `?type=POST&id=${post._id}`, state: { post } }}>&nbsp;</Link>
						<span className={styles["text"]}>{commentCount}</span>
					</div>
					{
						isSelf && 
						<div className={`${styles['cell']} ${styles['_delete']}`}>
							<div data-origin='delete'>
								<i data-icon className={styleIcons['ion-delete']} data-origin='delete'></i>
								<span data-origin='delete'>删除</span>
							</div>
						</div>
					}
				</div>
			</div>
		)
	}
	
  componentDidMount() {
		this._isMounted = true;
		const self = this;
		const { post, userInfo, showComment } = this.props;
		const userId = userInfo && userInfo.user ? userInfo.user.id : null;
		// getLikes({
		// 	type: "POST",
		// 	targetId: post._id
		// }).then(res => {
		// 	if (res.code === 200) {
		// 		res.data.forEach(cell => {
		// 			if (cell.userId === userId) {
		// 				self._isMounted && self.setState({
		// 					liked: true,
		// 					likeID: cell._id
		// 				})
		// 			}
		// 		})
		// 	}
		// }, error => {
		// 	console.log(error);
		// });
		// getFavorites({
		// 	type: "POST",
		// 	targetId: post._id
		// }).then(res => {
		// 	if (res.code === 200) {
		// 		res.data.forEach(cell => {
		// 			if (cell.userId === userId) {
		// 				self._isMounted && self.setState({
		// 					favorited: true,
		// 					favoriteID: cell._id
		// 				})
		// 			}
		// 		})
		// 	}
		// }, error => {
		// 	console.log(error);
		// });
	}

	componentDidUpdate() {
		const { showComment } = this.props;
		if(showComment) {
			document.addEventListener('click', this.__hidden);
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
		document.removeEventListener('click', this.__hidden);
	}
}


const mapStateToProps = state => {
	const { userInfo, appStatus } = state;
	return {
		userInfo
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CTABar);