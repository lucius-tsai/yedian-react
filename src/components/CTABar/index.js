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
	delFavoriteMessage,
	deletePost
} from '../../libs/api';
import { os } from '../../libs/uitls';

import { showComment, hiddenComment } from '../../store/actions/appStatus';
import {
	putPostList
} from '../../store/actions/posts';

class CTABar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showComment: false,
			liked: false,
			likeID: null,
			favorited: false,
			favoriteID: null,
			likeCount: 0,
			favoriteCount: 0,
			commentCount: 0,
      isSelf: false,
		}
		this.like = this.like.bind(this);
		this.favorite = this.favorite.bind(this);
		this.openComment = this.openComment.bind(this);
		this.deletePost = this.deletePost.bind(this);
		this.__hidden = this.__hidden.bind(this);
	}

	componentWillMount() {
		const { post, showComment, userInfo } = this.props;
		this.setState({
			likeCount: post.likeCount,
			favoriteCount: post.favoriteCount,
			commentCount: post.commentCount,
			showComment,
			isSelf: userInfo && userInfo.user && userInfo.user.id && userInfo.user.id === post.postedBy._id
		});
	}

	componentWillReceiveProps(nextProps) {
		const { showComment, userInfo, post } = nextProps;
		this.setState({
			showComment,
			isSelf: userInfo && userInfo.user && userInfo.user.id && userInfo.user.id === post.postedBy._id
		});
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
		if(os.isPhone) {
			document.body.className = 'no-scroll';
			document.body.style.height = '100vh';
		}
		__showComment();
	}

	__hidden(e) {
		const { __hiddenComment } = this.props;
		if(os.isPhone) {
			document.body.className = '';
			document.body.style.height = 'auto';
		}
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

  deletePost(e) {
		const { post, posts, putPostList } = this.props;
		const localPosts = Object.assign({}, JSON.parse(JSON.stringify({o: posts}))).o;
		deletePost(post._id).then(res => {
			if(res.code === 200) {
				localPosts.every((cell, index) => {
					if (post._id === cell._id) {
						localPosts.splice(index, 1);
						return false;
					} else {
						return true;
					}
				});
				setTimeout(() => {
					putPostList(localPosts);
				}, 100)
			}
		}, error => {

		});
    
  }

	render() {
		const { showComment, favorited, liked, likeCount, favoriteCount, commentCount, isSelf } = this.state;
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
					{
						isSelf && 
						<div className="cell _delete">
							<button onClick={this.deletePost} data-origin='delete'>删除</button>
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
		getLikes({
			type: "POST",
			targetId: post._id
		}).then(res => {
			if (res.code === 200) {
				res.data.forEach(cell => {
					if (cell.userId === userId) {
						self._isMounted && self.setState({
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
						self._isMounted && self.setState({
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
	const { userInfo, appStatus, posts } = state;
	return {
		userInfo,
		showComment: appStatus.showComment || false,
		posts: posts.posts || []
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		__showComment: (cell) => {
			dispatch(showComment(cell));
		},
		__hiddenComment: (cell) => {
			dispatch(hiddenComment(cell));
		},
    putPostList: (cell) => {
      dispatch(putPostList(cell))
    }
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CTABar);