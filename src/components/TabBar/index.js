import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './tabBar.scss';

let domain = '';
const query = '?fromwhere=community';
switch (process.env.NODE_ENV) {
  case "development":
    domain = "http://dev-app.ye-dian.com/dist/?#!/";
    break;
  case "staging":
    domain = "http://staging-app.ye-dian.com/dist/?#!/";
    break;
  case "production":
    domain = "http://prod-app.ye-dian.com/dist/?#!/";
    break;
  default:
    domain = "http://prod-app.ye-dian.com/dist/?#!/";
    break;
}

class TabBar extends Component {
  render() {
    const cellWidth = window.innerWidth > 414 ? 414 : window.innerWidth;
    return (
      <div className="tab-bar" style={{width: cellWidth, marginLeft: `-${cellWidth / 2}px`}}>
        <div className="item-index">
          <a href={`${domain}${query}`}>
            <div className="icon ion-index"></div>
            <span className="text">精选</span>
          </a>
        </div>
        <div className="item-list">
          <a href={`${domain}list/ktv${query}`}>
            <div className="icon ion-list"></div>
            <span className="text">预订</span>
          </a>
        </div>
        <div className="item-community active">
          <Link to={{pathname: `${BASENAME}community`}}>
            <div className="icon ion-community-active"></div>
            <span className="text">社区</span>
          </Link>
        </div>
        <div className="item-user">
          <a href={`${domain}user${query}`}>
            <div className="icon ion-user"></div>
            <span className="text">我的</span>
          </a>
        </div>
      </div>
    )
  }
}

export default TabBar;