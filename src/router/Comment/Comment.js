import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
	hideBar,
	showBar
} from '../../store/actions/appStatus';

import {
	getQueryString
} from '../../libs/uitls';
import {
	commentMessage
} from '../../libs/api';
import { track } from '../../libs/track';

import styles from './comment.scss';

let submitKey = false;

class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: null,
			targetId: null,
			target: null,
			comment: '',
			canSubmit: false
		};
		this.submit = this.submit.bind(this);
		this.input = this.input.bind(this);
	}

	componentWillMount() {
		const { hideBar, router } = this.props;
		
		const type = getQueryString('type');
		const id = getQueryString('id');
		const target = router && router.location && router.location.state && router.location.state.post
		this.setState({
			type: type,
			targetId: id,
			target
		});
    hideBar();
	}

	componentWillReceiveProps(nextProps) {
		// console.log(nextProps);
	}

	input(e) {
		const input = e.target.value.trim();
		this.setState({
			comment: input,
			canSubmit: input.length > 0
		});
	}

	submit(e) {

		if (submitKey) {
      return false;
    }
		submitKey = true;
		
		e.preventDefault();
		const { type, target, targetId } = this.state;
		const { history } = this.props;
		commentMessage({
			type: type.toLocaleUpperCase(),
			targetId: targetId,
			isDisplay: true,
			comment: this.state.comment
		}).then(res => {
			if (res.code === 200) {
				// track
				try {
					track('comment', Object.assign({
						$url: window.location.href,
						$path: window.location.pathname,
						title: target.message && target.message.description,
						post_type: target && target.postType === 1 ? "VENUES" : "USER",
						post_id: target && String(target._id),
						type: "POST",
						action_time: new Date()
					}, {}));
				} catch (error) {
				}
        return history.goBack();
			}
      submitKey = false;
		}, error => {
      submitKey = false;
		});
	}

	render() {
		const { target, canSubmit } = this.state;
		return (
			<div className={styles['comment-box']}>
				{/* <div className={styles['target']}>
					<h2>{target && target.message && target.message.description}</h2>
				</div> */}
				<form>
					<div className={styles['input-box']}>
						<textarea placeholder='我也要留下一评' onChange={this.input}></textarea>
					</div>
					<button className={styles.submit} onClick={this.submit} disabled={!canSubmit}>评论</button>
				</form>
			</div>
		)
	}

	componentDidMount() {
		document.title = "NIGHT+";
	}

	componentWillUnmount() {
    const { showBar, router } = this.props;
    const pathname = router.location.pathname;
		const reg = new RegExp(`^${BASENAME}topic|${BASENAME}search|${BASENAME}message`);
    if (!reg.test(pathname)) {
      showBar();
    }
	}
}

const mapStateToProps = state => {
  const { appStatus, router } = state;
  return {
    router,
    appStatus
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideBar: () => {
      dispatch(hideBar())
    },
    showBar: () => {
      dispatch(showBar())
    }
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Comment));