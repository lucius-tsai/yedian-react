import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './avator.scss';

import {parseDate} from '../../libs/uitls';

export default class Avator extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let {size, style, showFollow, profile, model, date} = this.props;
    this.setState({
      profile: profile ? profile : {
        headImgUrl: "http://www.wangmingdaquan.cc/tx61/66.jpg",
        displayName: 'N'
      },
      date: date ? parseDate('yyyy/mm/dd', new Date(date)) : parseDate('yyyy/MM/dd hh:mm:ss', new Date()),
      size: size ? size : "normal",
      style: style ? style : "horizontal", //vertical
      showFollow: showFollow ? showFollow : false,
      model: model ? model : undefined
    })
  }

  componentWillUnmount() {
  }

  render() {
    const {profile, size, style, showFollow, model, date} = this.state;
    return (
      <div className={`avator-box clearfix ${style} ${size}`}>
        <div className="avator">
          <img src={profile.headImgUrl} alt=""/>
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
  }
}