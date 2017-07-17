/**
 * Created by townmi on 17/6/18.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Avator from '../Avator';
import LoadMore from '../LoadMore';

import { getComments, commentMessage } from '../../libs/api';
import { showComment, hiddenComment } from '../../store/actions/appStatus';

import './comment.scss';
import style from './comment.css';


class Comment extends Component {

	constructor(props) {
		super(props);
		this.state = {
			profile: null,
			target: null,
			loading: false,
			completed: false,
			data: [],
			pagination: {
				pageSize: 2,
				current: 1
			},
			showComment: false,
		}

		this.handleScroll = this.handleScroll.bind(this);
		this.__openComment = this.__openComment.bind(this);
		this.comment = this.comment.bind(this);
		this.input = this.input.bind(this);
		this.pointY = null;
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

		this.setState({ showComment });
	}

	fetch() {
		const self = this;
		const { pagination, data } = this.state;
		const { target } = this.props;

		if (this.state.completed || this.state.loading) {
			return false;
		}

		const offset = (pagination.current - 1) * pagination.pageSize;

		this.setStateAynsc({
			loading: true
		}).then(() => {
			getComments({
				type: 'POST',
				targetId: target._id,
				limit: pagination.pageSize,
				skip: offset
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
						document.removeEventListener("touchstart", this.handleTouch);
						window.removeEventListener("scroll", this.handleScroll);
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
						document.removeEventListener("touchstart", this.handleTouch);
						window.removeEventListener("scroll", this.handleScroll);
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
			}, error => {
				self.setState({
					loading: false
				});
			});
		});
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


	comment(e) {
		const { target, userInfo } = this.props;
		commentMessage({
			type: 'POST',
			targetId: target._id,
			isDisplay: true,
			comment: this.state.comment
		}).then(res => {
			this.setState({
				showComment: false
			});
		}, error => {

		});
	}

	__openComment(e) {
		e.nativeEvent.stopImmediatePropagation();
		const { __showComment } = this.props;
		__showComment();
	}

	handleScroll(e) {
		const self = this;
		const documentHeight = document.body.clientHeight;
		const scrollHeight = window.scrollY;
		const distance = documentHeight - scrollHeight;
		if (distance < 700 && !this.state.loading && self.pointY < scrollHeight) {
			self.fetch();
		}

		setImmediate(() => {
			self.pointY = scrollHeight;
		});
	}

	handleTouch(e) {
		self.pointY = window.scrollY;
	}

	render() {
		const { profile, data, loading, showComment, showBtn } = this.state;
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
				<div className={showComment ? style.commentBox : `${style.commentBox} ${style.barHidden}`} onClick={e => { e.nativeEvent.stopImmediatePropagation(); }}>
					{
						showComment ?
							<textarea className={showBtn ? style.commentTxt : `${style.commentTxt} ${style.barHidden}`} placeholder='我也要留下一评' ref={this.focus} onChange={this.input}></textarea>
							: ''
					}
					<button className={showBtn ? style.commentBtn : `${style.commentBtn} ${style.barHidden}`} onClick={this.comment}>提交</button>
				</div>
			</div>
		)
	}
	componentDidMount() {

		document.removeEventListener("touchstart", this.handleTouch);
		window.removeEventListener("scroll", this.handleScroll);
		document.addEventListener("touchstart", this.handleTouch);
		window.addEventListener("scroll", this.handleScroll);

		this.fetch();
	}

	componentWillUnmount() {
		document.removeEventListener("touchstart", this.handleTouch);
		window.removeEventListener("scroll", this.handleScroll);
	}
}


const mapStateToProps = state => {
	const { router, userInfo, appStatus } = state;
	return {
		router,
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
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);