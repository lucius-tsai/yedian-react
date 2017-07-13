/**
 * Created by townmi on 17/6/18.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Avator from '../Avator';

import './comment.scss';

class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			profile: null,
			target: null
		}
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

	render() {
		const { profile } = this.state;
		return (
			<div className="comment">
				<div className="_title">夜猫子们评论</div>
				<div className="_top-enter clearfix">
					<div className="user-self">
						<Avator profile={profile} />
					</div>
					<div className="input-enter">我也要留下一评</div>
				</div>
				<ul className="comment-content">
					{/* <li className="cell">
						<Avator profile={profile} model={"default"} />
						<div className="_content">看了你的攻略去了，发现真的挺好玩的，感谢分享这么全面的教程，辛苦了～</div>
					</li>
					<li className="cell">
						<Avator profile={profile} model={"default"} />
						<div className="_content">看了你的攻略去了，发现真的挺好玩的，感谢分享这么全面的教程，辛苦了～</div>
					</li> */}
				</ul>
			</div>
		)
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
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);