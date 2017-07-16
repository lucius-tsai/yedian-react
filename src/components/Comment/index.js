/**
 * Created by townmi on 17/6/18.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Avator from '../Avator';

import './comment.scss';
import { getComments } from '../../libs/api';

import { showComment } from '../../store/actions/appStatus';

class Comment extends Component {

	constructor(props) {
		super(props);
		this.state = {
			profile: null,
			target: null,
			data: []
		}
		this.__openComment = this.__openComment.bind(this);
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
		const { userInfo } = nextProps;
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
	}

	fetch() {
		const self = this;
		const { target } = this.props;
		getComments({
			type: 'POST',
			targetId: target._id
		}).then(res => {
			if(res.code === 200) {
				const list = [];
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
				const tmp = this.state.data.concat(list);
				self.setState({
					data: tmp
				});
			}
		}, error => {

		})
	}

	__openComment(e) {
		e.nativeEvent.stopImmediatePropagation();
		const { showComment } = this.props;
		showComment();
	}

	render() {
		const { profile, data } = this.state;
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
						data.length && data.map(cell => {
							return (
								<li className="cell" key={cell._id}>
									<Avator profile={cell.profile} model={"default"} />
									<div className="_content">{cell.comment}</div>
								</li>
							)
						})
					}
				</ul>
			</div>
		)
	}
	componentDidMount() {
		this.fetch();
	}

	componentWillUnmount() {
	}
}


const mapStateToProps = state => {
	const { router, userInfo } = state;
	return {
		router,
		userInfo
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		showComment: (cell) => {
			dispatch(showComment(cell))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);