/**
 * Created by townmi on 17/6/4.
 */
import React, { Component } from 'react';
import styles from './venuesCell.scss';

export default class VenuesCell extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { simple, venuesInfo } = this.props;

		const picture = venuesInfo && venuesInfo.images ? venuesInfo.images[0] : 'http://ooa2erl8d.bkt.clouddn.com/e7e137bdcce28ade3568385ba936f480';
		const name = venuesInfo && venuesInfo.name ? venuesInfo.name : 'UFO';
		const id = venuesInfo && venuesInfo._id ? venuesInfo._id : '';
		return (
			<div className={`${styles['venues-cell']} ${styles['clearfix']}`}>
				<div className={styles["img-holder"]} style={{ backgroundImage: `url(${picture})` }}>
				</div>
				<p className={styles["name"]}>
					<span>{name}</span>
				</p>
				{
					simple ? ""
						: <div className={styles["combo"]}>
							<span>更多优惠套餐</span>
						</div>
				}
			</div>
		)
	}
}