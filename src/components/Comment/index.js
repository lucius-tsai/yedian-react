/**
 * Created by townmi on 17/6/18.
 */
import React, { Component } from 'react';

import Avator from '../Avator';

import './comment.scss';

export default class VenuesCell extends Component {
	render() {
		const profile = {
			avator: "http://www.wangmingdaquan.cc/tx61/66.jpg",
			username: "你才是酸爽的白菜",
			date: "40分钟前"
		};
		return (
			<div className="comment">
				<div className="_title">夜猫子们评论</div>
				<div className="_top-enter clearfix">
					<div className="user-self">
						<Avator />
					</div>
					<div className="input-enter">我也要留下一评</div>
				</div>
				<ul className="comment-content">
					<li className="cell">
						<Avator profile={profile} model={"default"} />
						<div className="_content">看了你的攻略去了，发现真的挺好玩的，感谢分享这么全面的教程，辛苦了～</div>
					</li>
					<li className="cell">
						<Avator profile={profile} model={"default"} />
						<div className="_content">看了你的攻略去了，发现真的挺好玩的，感谢分享这么全面的教程，辛苦了～</div>
					</li>
				</ul>
			</div>
		)
	}
}