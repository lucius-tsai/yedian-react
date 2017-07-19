/**
 * Created by townmi on 17/6/18.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Avator from '../Avator';
import LoadMore from '../LoadMore';

import { getComments, commentMessage } from '../../libs/api';
import { os } from '../../libs/uitls';

import {
	showComment,
	hiddenComment,
	hiddenScrollLoading,
	showScrollLoading
} from '../../store/actions/appStatus';

import './comment.scss';
import style from './comment.css';

class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			profile: null,
			target: null,
			data: [],
			showComment: false,
			showBtn: false,
			pagination: {
				pageSize: 2,
				current: 1
			},
			offset: 0,
			loading: false,
			completed: false,
		}

		this.__openComment = this.__openComment.bind(this);
		this.comment = this.comment.bind(this);
		this.input = this.input.bind(this);
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
				target
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		const { userInfo, showComment } = nextProps;
		if (userInfo && userInfo.user && userInfo.user.id) {
			this.setState({
				profile: {
					userType: 'User',
					_id: userInfo.user.id,
					displayName: userInfo.user.displayName,
					headImgUrl: userInfo.user.Wechat && userInfo.user.Wechat.headimgurl
				}
			})
		}
		if (!showComment) {
			this.setState({ showComment, showBtn: false });
		} else {
			this.setState({ showComment });
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
		const { pagination, data, offset } = this.state;
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
						list.push({
							profile: {
								_id: cell.userId,
								displayName: cell.userInfo.displayName,
								headImgUrl: cell.userInfo.Wechat.headimgurl,
								userType: 'User'
							},
							comment: cell.comment,
							_id: cell._id
						});
					});

					const merge = data.concat(list);
					if (merge.length === total) {
						self.setState({
							completed: true,
							loading: false,
							pagination: {
								total,
								pageSize: pagination.pageSize,
								current: (pagination.current + 1)
							}
						});
					}

					if (!res.data.commentList.length) {
						self.setState({
							completed: true,
							loading: false
						});
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

	focus(ref) {
		if (ref) {
			if (os.isPhone) {
				document.body.className = 'no-scroll';
				document.body.style.height = '100vh';
			}
			ref.focus();
		}
	}

	input(e) {
		const input = e.target.value.trim();
		this.setState({
			comment: input,
			showBtn: !!input.length
		});
	}


	comment(e) {
		const { data } = this.state;
		const { target, userInfo, __hiddenComment } = this.props;
		commentMessage({
			type: 'POST',
			targetId: target._id,
			isDisplay: true,
			comment: this.state.comment
		}).then(res => {

			if (res.code === 200) {

				data.unshift({
					_id: res.data._id,
					comment: res.data.comment,
					profile: {
						_id: userInfo.user.id,
						displayName: userInfo.user.displayName,
						headImgUrl: userInfo.user.Wechat.headimgurl,
						userType: 'User'
					}
				});

				this.setState({
					data,
					offset: (this.state.offset + 1)
				});
				__hiddenComment();
			}
		}, error => {

		});
	}

	__openComment(e) {
		e.nativeEvent.stopImmediatePropagation();
		const { __showComment } = this.props;
		__showComment();
	}

	render() {
		const { profile, data, loading, completed, showComment, showBtn } = this.state;
		return (
			<div className="comment">
				<div className="_title">夜猫子们评论</div>
				<div className="_top-enter clearfix">
					<div className="user-self">
						<Avator profile={profile} />
					</div>
					<div className="input-enter" onClick={this.__openComment}>我也要留下一评</div>
				</div>
				<ul className="comment-content">
					{
						!!data.length && data.map(cell => {
							return (
								<li className="cell" key={cell._id}>
									<Avator profile={cell.profile} model={"default"} />
									<div className="_content">{cell.comment}</div>
								</li>
							)
						})
					}
				</ul>
				{
					loading ? <LoadMore /> : ""
				}
				{
					completed && <p style={{ textAlign: 'center' }}>没有更多数据了</p>
				}
				<div className={showComment ? style.commentBox : `${style.commentBox} ${style.barHidden}`} onClick={e => { e.nativeEvent.stopImmediatePropagation(); }}>
					{
						showComment ?
							<textarea className={showBtn ? style.commentTxt : `${style.commentTxt} ${style.btnHidden}`} placeholder='我也要留下一评' ref={this.focus} onChange={this.input}></textarea>
							: ''
					}
					<button className={showBtn ? style.commentBtn : `${style.commentBtn} ${style.btnHidden}`} onClick={this.comment}>提交</button>
				</div>
			</div>
		)
	}
	componentDidMount() {
		this.props.showScrollLoading();
		this.fetch();
	}

	componentWillUnmount() {
	}
}


const mapStateToProps = state => {
	const { router, userInfo, appStatus } = state;
	return {
		router,
		scrollLoading: appStatus.scrollLoading || false,
		userInfo,
		showComment: appStatus.showComment || false
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		__showComment: (cell) => {
			dispatch(showComment(cell))
		},
		__hiddenComment: (cell) => {
			dispatch(hiddenComment(cell));
		},
		showScrollLoading: (cell) => {
			dispatch(showScrollLoading(cell));
		},
		hiddenScrollLoading: () => {
			dispatch(hiddenScrollLoading())
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);