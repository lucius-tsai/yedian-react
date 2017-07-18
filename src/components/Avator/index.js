import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './avator.scss';

import { parseDate } from '../../libs/uitls';
import { getFollwers, creatFollow } from '../../libs/api';

import defaultAvator from './default.jpg';

/**
 * [头像组件]
 * profile [用户的名字和头像等]
 * date [日期]
 * size [头像大小]
 * style [头像样式]
 * showFollow [是否显示关注按钮]
 * model [头像样式]
 * disabledLink [头像是否可以点击]
 * affiliates [商家等头像特殊处理]
 * @export
 * @class Avator
 * @extends {Component}
 */
class Avator extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    let { size, style, showFollow, profile, model, date, disabledLink, affiliates } = this.props;
    this.setState({
      profile: profile ? profile : {
        headImgUrl: "http://www.wangmingdaquan.cc/tx61/66.jpg",
        displayName: 'N'
      },
      date: date ? parseDate('yyyy/mm/dd', new Date(date)) : parseDate('yyyy/MM/dd hh:mm:ss', new Date()),
      size: size ? size : "normal",
      style: style ? style : "horizontal", //vertical
      showFollow: showFollow ? showFollow : false,
      model: model ? model : undefined,
      disabledLink: disabledLink ? disabledLink : false,
      affiliates: affiliates ? affiliates : null
    });
    this.handleFollow = this.handleFollow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { userInfo } = nextProps;
    const { profile } = this.state;
    if (userInfo && userInfo.user && userInfo.user.id && userInfo.user.id === profile._id) {
      this.setState({
        showFollow: false
      })
    }
  }

  handleFollow() {
    const { profile } = this.state;
    console.log(profile);
    creatFollow({
      type: profile.userType === 'User' ? 'USER' : 'VENUES',
      targetId: profile.userType === 'User' ? profile._id : profile.venuesId
    }).then(res => {

    });
  }

  render() {
    const { profile, size, style, showFollow, model, date, disabledLink, affiliates } = this.state;
    const query = '?fromwhere=community';

    return (
      <div className={`avator-box clearfix ${style} ${size}`}>
        {
          disabledLink &&
          <div className="avator">
            <img src={profile.headImgUrl ? profile.headImgUrl : defaultAvator} alt="" />
          </div>
        }
        {
          !disabledLink && profile.userType === 'User' &&
          <Link className="avator" to={{ pathname: `${BASENAME}user/times/${profile._id}`, state: profile }}>
            <img src={profile.headImgUrl ? profile.headImgUrl : defaultAvator} alt="" />
          </Link>
        }
        {
          !disabledLink && profile.userType === 'VenuesManager' &&
          <a className="avator" href={`${location.origin}/dist/?#!/ktv/${profile.venuesId}${query}`}>
            <img src={profile.venuesImage ? profile.venuesImage : defaultAvator} alt="" />
          </a>
        }
        {
          model === "default" && profile.userType === 'User' &&
          <div className="profile">
            <strong>{profile.displayName}</strong>
            <p>{date}</p>
          </div>
        }
        {
          model === "default" && profile.userType === 'VenuesManager' &&
          <div className="profile">
            <strong>{profile.venuesName}</strong>
            <p>{date}</p>
          </div>
        }
        {
          model === "followCard" ?
            <div className="profile">
              <strong>{profile.username}</strong>
              <p>{`${profile.city}-${profile.area}`}</p>
            </div>
            : ''
        }
        {
          model === "userTimeLine" ?
            <div className="profile user-time-line">
              <strong>{profile.username}</strong>
            </div>
            : ''
        }
        {
          showFollow ?
            <div className="follow-box" onClick={this.handleFollow}>
              <button>关注</button>
            </div>
            : ''
        }
      </div>
    )
  }

  componentDidMount() {
    const { userInfo } = this.props;
    const { profile, showFollow } = this.state;
    console.log(userInfo.user.id);
    if (userInfo && userInfo.user && userInfo.user.id && userInfo.user.id === profile._id) {
      this.setState({
        showFollow: false
      })
    } else if (showFollow) {
      getFollwers({
        type: profile.userType === 'User' ? 'USER' : 'VENUES'
      }).then(res => {
        if (res.code === 200) {
          res.data.forEach(cell => {
            if (cell.userId === userInfo.user.id) {
              this.setState({
                showFollow: false
              });
            }
          });
        }
      }, error => {

      })
    }
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
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Avator);