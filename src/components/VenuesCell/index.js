/**
 * Created by townmi on 17/6/4.
 */
import React, { Component } from 'react';
import './venuesCell.scss';

export default class VenuesCell extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { simple } = this.props;
		return (
			<div className="venues-cell clearfix">
				<div className="img-holder" style={{ backgroundImage: 'url(http://ooa2erl8d.bkt.clouddn.com/e7e137bdcce28ade3568385ba936f480)' }}>
				</div>
				<p className="name">
					<span>欢乐迪氧吧KTV</span>
				</p>
				{
					simple ? ""
						: <div className="combo" >
							<span>更多优惠套餐</span>
						</div>
				}
			</div>
		)
	}
}