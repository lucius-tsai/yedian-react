import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	loading,
	loadSuccess,
	loadFail,
	hideBar,
	showBar
} from '../../store/actions/appStatus';
import {
  getUserInfoLoading,
  getUserInfoSuccess,
  getUserInfoFail
} from '../../store/actions/userInfo';

import { cookie, deleteAllCookies } from '../../libs/uitls';
import { sendSMS, smsLogin, getUserInfo } from '../../libs/api';
import { trackLogin, trackSetProfile, trackSetOnceProfile } from '../../libs/track';

import style from './login.scss';
import icons from "../../icons/scss/ionicons";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			account: {
				mobile: "",
				code: ""
			},
			captchaTxt: '发送验证码',
			captchaSeconds: 60,
			canSendSMS: false,
			isSendSMS: false,
			canLogin: false,
			isLogin: false
		}
		this.timer = null;
		this.sendSMS = this.sendSMS.bind(this);
		this.filterMobile = this.filterMobile.bind(this);
		this.filterCaptcha = this.filterCaptcha.bind(this);
		this.submit = this.submit.bind(this);
	}

	componentWillMount() {
		const self = this;
		const { hideBar, history } = this.props;
		hideBar();
		if (cookie('js_session')) {
			return history.goBack();
		}
	}

	getUserInfo() {
    const {
      getUserInfoLoading,
      getUserInfoSuccess,
			getUserInfoFail,
			loadSuccess
    } = this.props;
    getUserInfoLoading();

    getUserInfo().then(res => {
      if (res.code === 200) {
				getUserInfoSuccess(res.data);
				loadSuccess();
        /**
         * 登陆成功 && 获取用户基础信息 && 监测介入
         */
        let profile = {
          userId: res.data.id,
          $province: res.data.Wechat && res.data.Wechat.province,
          $city: res.data.Wechat && res.data.Wechat.city,
          $name: res.data.displayName,
          mobile: res.data.mobile
        };
        trackLogin(res.data.id);
        trackSetProfile(profile, res.data.level);
        trackSetOnceProfile({});
        localStorage.setItem('react_user', JSON.stringify(res.data));
      } else {
        getUserInfoFail()
      }
    }).catch(error => {
      getUserInfoFail()
      const msg = error.message;
      console.log(msg);
      if (/403/g.test(msg)) {
        deleteAllCookies();
        window.location.reload();
      }
    });
  }

	sendSMS(e) {
		e.preventDefault();
		const self = this;
		let seconds = this.state.captchaSeconds;
		if (this.state.isSendSMS) {
			return false
		}
		if (!this.state.canSendSMS) {
			return alert('请输入正确的手机号')
		}
		this.setState({
			isSendSMS: true
		}, () => {
			sendSMS({
				mobile: this.state.account.mobile
			}).then(res => {
				if (res.code === 200) {
					this.timer = setInterval(() => {
						seconds--;
						if (seconds < 0) {
							clearInterval(this.timer);
							self.setState({
								captchaTxt: `重新发送`,
								isSendSMS: false,
								captchaSeconds: 120
							});
						} else {
							self.setState({
								captchaTxt: `重新发送(${seconds})`
							});
						}
					}, 1000);
				} else {
					self.setState({
						isSendSMS: false
					});
				}
			}, error => {
				self.setState({
					isSendSMS: false
				});
			});
		});
	}

	filterMobile(e) {
		const input = e.target.value.trim();
		this.setState({
			account: {
				mobile: input,
				code: this.state.account.code
			},
			canSendSMS: /^1[3,4,5,7,8]{1}[0-9]{9}$/.test(input)
		});
	}

	filterCaptcha(e) {
		const input = e.target.value.trim();
		this.setState({
			account: {
				mobile: this.state.account.mobile,
				code: input
			},
			canLogin: this.state.canSendSMS && /^[0-9]{6}$/.test(input)
		});
	}

	submit(e) {
		e.preventDefault();
		const { location, history, loading, loadFail, userInfo } = this.props;
		const redirectUri = location && location.state && location.state.redirectUri ? location.state.redirectUri : `${BASENAME}community`;
		if (this.state.isLogin) {
			return false;
		}
		if (!this.state.canSendSMS) {
			return alert('请输入正确的手机号');
		} else if (!this.state.canLogin) {
			return alert('请输入有效六位数字短信验证码');
		}
		loading()
		smsLogin(this.state.account).then(res => {
			if (res.code === 200) {
				// 登录成功
				cookie('js_session', res.data, { path: '/', expires: 7 });
				// 登录成功立即获取用户信息。可以在一次loading完成，提高体验
				if (!(userInfo && userInfo.user && userInfo.user.id) && !userInfo.loading) {
					this.getUserInfo();
				}
			} else {
				loadFail();
			}
		}, error => {
			loadFail();
		});
	}
	render() {
		const { account, captchaTxt, isSendSMS, isLogin } = this.state;
		return (
			<div className={style.login}>
				<div className={style.logo}>
					<span></span>
					<img alt="Night Plus" src={require('../../assets/images/logo-sprite.png')} />
				</div>
				<div className={style.loginForm}>
					<ul className={style.list}>
						<li>
							<i className={icons['ion-login-user']} data-icon></i>
							<input type="tel" placeholder="手机" maxLength="11" onChange={this.filterMobile} />
						</li>
						<li className={style.captchaBox}>
							<i className={icons['ion-login-captcha']} data-icon></i>
							<input type="number" placeholder="验证码" maxLength="6" onChange={this.filterCaptcha} />
							<button className={style.btn} onClick={this.sendSMS}>{captchaTxt}</button>
						</li>
					</ul>
					<button className={style.submitBtn} onClick={this.submit}>登 录</button>
				</div>
				<div className={style.footer}>
					<a href="tel:4006507351"> 联系客服 </a>
				</div>
			</div>
		)
	}
	componentWillUnmount() {
		const { showBar, router } = this.props;
		const token = cookie('js_session');
		clearInterval(this.timer);
		if (router && router.action.toLocaleLowerCase() !== 'pop') {
			showBar();
		}

		if (!token) {
			return window.location.reload();
		}
	}
}

const mapStateToProps = state => {
	const { appStatus, router, userInfo } = state;
	return {
		router,
		userInfo
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		loading: () => {
			dispatch(loading())
		},
		loadSuccess: () => {
			dispatch(loadSuccess())
		},
		loadFail: () => {
			dispatch(loadFail())
		},
		getUserInfoLoading: () => {
      dispatch(getUserInfoLoading())
    },
    getUserInfoSuccess: (cell) => {
      dispatch(getUserInfoSuccess(cell))
    },
    getUserInfoFail: (cell) => {
      dispatch(getUserInfoFail(cell));
    },
		hideBar: () => {
			dispatch(hideBar())
		},
		showBar: () => {
			dispatch(showBar())
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);