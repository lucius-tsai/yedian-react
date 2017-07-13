import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './avator.scss';

import { parseDate } from '../../libs/uitls';

import defaultAvator from './default.jpg';

export default class Avator extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let { size, style, showFollow, profile, model, date, disabledLink } = this.props;
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
      disabledLink: disabledLink ? disabledLink : false
    })
  }

  componentWillUnmount() {
  }

  render() {
    const { profile, size, style, showFollow, model, date, disabledLink } = this.state;
    const query = '?fromwhere=community';
    let venuesId = '';
    // post.affiliates.forEach(cell => {
    //   if (cell.type === 'VENUES') {
    //     venuesId = cell.targetId;
    //   }
    // });
    if (profile.userType === 'User') {
      if (disabledLink) {
        return (
          <div className={`avator-box clearfix ${style} ${size}`}>
            <div className="avator">
              <img src={profile.headImgUrl ? profile.headImgUrl : defaultAvator} alt="" />
            </div>
            {
              model === "default" ?
                <div className="profile">
                  <strong>{profile.displayName}</strong>
                  <p>{date}</p>
                </div>
                : ''
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
                <div className="follow-box">
                  <button>关注</button>
                </div>
                : ''
            }
          </div>
        )
      } else {
        return (
          <Link className={`avator-box clearfix ${style} ${size}`} to={{ pathname: `${BASENAME}user/times/${profile._id}`, state: profile }}>
            <div className="avator">
              <img src={profile.headImgUrl ? profile.headImgUrl : defaultAvator} alt="" />
            </div>
            {
              model === "default" ?
                <div className="profile">
                  <strong>{profile.displayName}</strong>
                  <p>{date}</p>
                </div>
                : ''
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
                <div className="follow-box">
                  <button>关注</button>
                </div>
                : ''
            }
          </Link>
        )
      }
    } else {
      return (
          <a className={`avator-box clearfix ${style} ${size}`} href={`${location.origin}/dist/?#!/ktv/${venuesId}${query}`}>
            <div className="avator">
              <img src={profile.headImgUrl ? profile.headImgUrl : defaultAvator} alt="" />
            </div>
            {
              model === "default" ?
                <div className="profile">
                  <strong>{profile.displayName}</strong>
                  <p>{date}</p>
                </div>
                : ''
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
                <div className="follow-box">
                  <button>关注</button>
                </div>
                : ''
            }
          </a>
        )
    }


  }
}