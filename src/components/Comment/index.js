/**
 * Created by townmi on 17/6/18.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Avator from '../Avator';
import LoadMore from '../LoadMore';
import Alert from '../Alert';

import {
	getComments,
	infrom,
	likeComment,
	deleteLikeComment,
	deleteComment
} from '../../libs/api';
import { os } from '../../libs/uitls';

import {
	hiddenScrollLoading,
	showScrollLoading
} from '../../store/actions/appStatus';

import styles from './comment.scss';
import styleIcons from "../../icons/scss/ionicons";
import styleBase from "../../assets/scss/base";

/**
 * 评论组件
 * @class Comment
 * @extends {Component}
 */
class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			profile: null,
			target: null,
			data: [],
			pagination: {
				pageSize: 10,
				current: 1
			},
			offset: 0,
			loading: false,
			completed: false,
			userId: null,
			// showAlert: false,
		}
		this.infromComment = this.infromComment.bind(this);
	}

	setStateAynsc(state) {
		return new Promise((resolve, reject) => {
			this.setState(state, resolve);
		});
	}

	componentWillMount() {
		const { userInfo, target } = this.props;
		if (userInfo && userInfo.user && userInfo.user.id) {
			this.setState({
				profile: {
					userType: 'User',
					_id: userInfo.user.id,
					displayName: userInfo.user.displayName,
					headImgUrl: userInfo.user.Wechat && userInfo.user.Wechat.headimgurl
				},
				target,
				userId: userInfo && userInfo.user && userInfo.user.id
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		const { userInfo, target } = nextProps;
		if (userInfo && userInfo.user && userInfo.user.id) {
			this.setState({
				profile: {
					userType: 'User',
					_id: userInfo.user.id,
					displayName: userInfo.user.displayName,
					headImgUrl: userInfo.user.Wechat && userInfo.user.Wechat.headimgurl
				},
				userId: userInfo && userInfo.user && userInfo.user.id
			})
		}

		if (nextProps.scrollLoading && !this.state.completed) {
			this.fetch();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		const { data } = this.state;
		const { nextData } = nextState;
		if (data && nextData && (data.length === nextData.length)) {
			return false;
		} else {
			return true;
		}
	}

	fetch() {
		const self = this;
		const { pagination, data, offset, userId } = this.state;
		const { target, hiddenScrollLoading } = this.props;

		if (this.state.completed || this.state.loading) {
			return false;
		}

		const skip = (pagination.current - 1) * pagination.pageSize + offset;

		this.setStateAynsc({
			loading: true
		}).then(() => {
			getComments({
				type: 'POST',
				targetId: target._id,
				limit: pagination.pageSize,
				skip
			}).then(res => {
				if (res.code === 200) {
					const list = [], total = res.data.count;
					res.data.commentList.forEach(cell => {
						let liked = false;
						cell.like && cell.like.forEach(cell => {
							liked = cell.userId === userId;
						});
						list.push({
							profile: {
								_id: cell.userId,
								displayName: cell.userInfo.displayName || (cell.userInfo.mobile && `${cell.userInfo.mobile.substring(0, 3)}****${`${cell.userInfo.mobile} `.slice(-5, -1)}`),
								headImgUrl: cell.userInfo.Wechat && cell.userInfo.Wechat.headimgurl,
								userType: 'User'
							},
							like: cell.like,
							__liked: liked,
							createdAt: cell.createdAt,
							comment: cell.comment,
							_id: cell._id,
							userId: cell.userId
						});
					});

					const merge = data.concat(list);
					if (merge.length === total || !(total > this.state.pagination.pageSize)) {
						self.setState({
							completed: true,
							loading: false,
							pagination: {
								total,
								pageSize: pagination.pageSize,
								current: (pagination.current + 1)
							}
						});
						// return false;
					}

					if (!res.data.commentList.length) {
						self.setState({
							completed: true,
							loading: false
						});
						// return false;
					}

					self.setState({
						data: merge,
						loading: false,
						pagination: {
							total,
							pageSize: pagination.pageSize,
							current: (pagination.current + 1)
						}
					});
				} else {
					self.setState({
						loading: false
					});
				}
				hiddenScrollLoading();
			}, error => {
				self.setState({
					loading: false
				});
				hiddenScrollLoading();
			});
		});
	}

	likeComment(index) {
		const { data } = this.state;
		const self = this;
		if (data[index].__liked) {
			deleteLikeComment(data[index]._id).then(res => {
				if (res.code === 200) {
					data[index].__liked = !data[index].__liked;
					self.setState({
						data,
						// showAlert: true
					});
				}
			}, error => {

			});
		} else {
			likeComment({
				commentId: data[index]._id
			}).then(res => {
				if (res.code === 200) {
					data[index].__liked = !data[index].__liked;
					self.setState({
						data,
						// showAlert: true
					});
				}
			}, error => {

			});
		}
	}

	infromComment(cm) {
		infrom({
			commentId: cm._id
		}).then(res => {
			if (res.code === 200) {

			}
		}, error => {

		});
	}

	deleteComment(index) {
		const self = this;
		const { data } = this.state;
		const { updateComments, target } = this.props;
		deleteComment(data[index]._id).then(res => {
			if (res.code === 200) {
				updateComments((target.commentCount * 1 - 1))
				setTimeout(() => {
					data.splice(index, 1);
					self.setState(data);
				}, 200);
			}
		}, error => {

		});
	}

	showMoreActions(ref) {
		const className = ref && ref.className;
		ref && ref.addEventListener && ref.addEventListener('click', (e) => {
			e.stopPropagation();
			const actions = document.querySelectorAll('div[data-actions]');
			actions.forEach(cell => {
				cell.className = styles['actions'];
			});
			let parent = ref.parentNode;
			parent.className = /active/g.test(parent.className) ? styles['actions'] : `${styles['actions']} ${styles['active']}`;
		});
	}

	handleClick(ref) {
		const className = ref && ref.className;
		ref && ref.addEventListener && ref.addEventListener('click', (e) => {
			if (e && e.target && e.target.dataset && e.target.dataset.origin === 'delete') {
				ref.className = `${ref.className} bounceOutRight animated`;
				setTimeout(() => {
					ref.className = className;
				}, 300);
			}
		});
	}

	render() {
		const { profile, data, target, userId, loading, completed } = this.state;
		return (
			<div className={styles["comment"]}>
				<div className={styles["_title"]}>夜猫子们评论</div>
				<div className={`${styles['_top-enter']} ${styleBase['clearfix']}`}>
					<div className={styles["user-self"]}>
						<Avator profile={profile} />
					</div>
					<Link to={{ pathname: `${BASENAME}comment`, search: `?type=POST&id=${target._id}`, state: { post: target } }} className={styles["input-enter"]}>我也要留下一评</Link>
				</div>
				<ul className={styles["comment-content"]}>
					{
						!!data.length && data.map((cell, index) => {
							return (
								<li className={styles["cell"]} key={cell._id} ref={this.handleClick}>
									<div className={styles["avator-action"]}>
										<Avator profile={cell.profile} model={"default"} date={cell.createdAt} />
										<div data-actions="ref" className={styles["actions"]}>
											<i className={`${styleIcons['ion-action-more']} ${styles['_more']}`} ref={this.showMoreActions} data-icon></i>
											{
												cell.userId !== userId ?
													<div className={styles["btns"]}>
														<span className={cell.__liked ? `${styleIcons['ion-cta-like']} ${styles['active']}` : `${styleIcons['ion-cta-like']}`} onClick={this.likeComment.bind(this, index)} data-icon>&nbsp;点赞</span>
														<span data-icon className={styleIcons['ion-report']} onClick={this.infromComment.bind(this, cell)}>&nbsp;举报</span>
													</div>
													:
													<div className={styles["btns"]} style={{ width: `50px` }}>
														<span data-icon data-origin='delete' className={styleIcons['ion-delete']} onClick={this.deleteComment.bind(this, index)}>&nbsp;删除</span>
													</div>
											}
										</div>
									</div>
									<div className={styles["_content"]}>
										<pre>
											{cell.comment}
										</pre>
									</div>
								</li>
							)
						})
					}
				</ul>
				{
					loading && <LoadMore />
				}
				{
					completed && <p style={{ textAlign: 'center' }}>没有更多数据了</p>
				}
				{/* <Alert visiable={this.state.showAlert} /> */}
			</div>
		)
	}
	componentDidMount() {
		// this.props.showScrollLoading();
		this.fetch();
		document.addEventListener('click', () => {
			const actions = document.querySelectorAll('div[data-actions]');
			actions.forEach(cell => {
				cell.className = styles['actions'];
			});
		});
	}

	componentWillUnmount() {
	}
}


const mapStateToProps = state => {
	const { router, userInfo, appStatus } = state;
	return {
		router,
		scrollLoading: appStatus.scrollLoading || false,
		userInfo
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		showScrollLoading: (cell) => {
			dispatch(showScrollLoading(cell));
		},
		hiddenScrollLoading: () => {
			dispatch(hiddenScrollLoading())
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);