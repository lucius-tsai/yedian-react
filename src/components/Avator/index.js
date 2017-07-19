import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './avator.scss';

import { parseDate } from '../../libs/uitls';
import { getFollwers, creatFollow } from '../../libs/api';

import { getVenuesFollowers, getVenuesFollowersFail, getUserFollowers, getUserFollowersFail, setUserFollowers, setVenuesFollowers } from '../../store/actions/followers';

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
    const { userInfo, followers } = nextProps;
    const { profile } = this.state;
    if (userInfo && userInfo.user && userInfo.user.id && userInfo.user.id === profile._id) {
      this.setState({
        showFollow: false
      })
    }
    if (profile.userType.toLocaleLowerCase() === 'user') {
      followers.userFollowers && followers.userFollowers.forEach(cell => {
        if (cell.targetId === profile._id) {
          this.setState({
            showFollow: false
          });
        }
      });
    } else if (profile.userType.toLocaleLowerCase() === 'venuesmanager') {
      followers.venuesFollowers && followers.venuesFollowers.forEach(cell => {
        if (cell.targetId === profile.venuesId) {
          this.setState({
            showFollow: false
          });
        }
      });
    }
  }

  handleFollow() {
    const { profile } = this.state;
    const { 
      setVenuesFollowers,
      getVenuesFollowers,
      getVenuesFollowersFail,
      setUserFollowers,
      getUserFollowers,
      getUserFollowersFail,
    } = this.props;

    creatFollow({
      type: profile.userType === 'User' ? 'USER' : 'VENUES',
      targetId: profile.userType === 'User' ? profile._id : profile.venuesId
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          showFollow: false
        });

        if (profile.userType === 'User') {
          getUserFollowers();
          getFollwers({
            type: 'USER'
          }).then(res => {
            if (res.code === 200) {
              setUserFollowers(res.data);
            } else {
              getUserFollowersFail();
            }
          }, error => {
            getUserFollowersFail();
          });
        } else {
          getVenuesFollowers();
          getFollwers({
            type: 'VENUES'
          }).then(res => {
            if (res.code === 200) {
              setVenuesFollowers(res.data);
            } else {
              getVenuesFollowersFail();
            }
          }, error => {
            getVenuesFollowersFail();
          });
        }
      }
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
    const { userInfo, followers } = this.props;
    const { profile, showFollow } = this.state;

    if (userInfo && userInfo.user && userInfo.user.id && userInfo.user.id === profile._id) {
      this.setState({
        showFollow: false
      })
    } else if (showFollow) {
      if (profile.userType.toLocaleLowerCase() === 'user') {
        followers.userFollowers && followers.userFollowers.forEach(cell => {
          if (cell.targetId === profile._id) {
            this.setState({
              showFollow: false
            });
          }
        });
      } else if (profile.userType.toLocaleLowerCase() === 'venuesmanager') {
        followers.venuesFollowers && followers.venuesFollowers.forEach(cell => {
          if (cell.targetId === profile.venuesId) {
            this.setState({
              showFollow: false
            });
          }
        });
      }
    }
  }

  componentWillUnmount() {
  }

}


const mapStateToProps = state => {
  const { router, userInfo, followers } = state;
  return {
    router,
    userInfo,
    followers
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserFollowers: (cell) => {
      dispatch(getUserFollowers(cell));
    },
    getUserFollowersFail: (cell) => {
      dispatch(getUserFollowersFail(cell));
    },
    setUserFollowers: (cell) => {
      dispatch(setUserFollowers(cell));
    },
    getVenuesFollowers: (cell) => {
      dispatch(getVenuesFollowers(cell));
    },
    getVenuesFollowersFail: (cell) => {
      dispatch(getVenuesFollowersFail(cell));
    },
    setVenuesFollowers: (cell) => {
      dispatch(setVenuesFollowers(cell));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Avator);