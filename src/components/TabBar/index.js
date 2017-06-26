import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {Link} from 'react-router-dom';
import './tabBar.scss';

let domain = "";

switch (process.env.NODE_ENV) {
  case "development":
    domain = "http://staging-app.ye-dian.com/dist/";
    break;
  case "staging":
    domain = "http://staging-app.ye-dian.com/dist/";
    break;
  case "production":
    domain = "http://staging-app.ye-dian.com/dist/";
    break;
  default:
    domain = "http://staging-app.ye-dian.com/dist/";
    break;
}


class TabBar extends Component {
  render() {
    const cellWidth = window.innerWidth > 414 ? 414 : window.innerWidth;
    return (
      <div className="tab-bar" style={{width: cellWidth, marginLeft: `-${cellWidth / 2}px`}}>
        <div className="item-index">
          <a href={`${domain}`}>
            <div className="icon ion-index"></div>
            <span className="text">精选</span>
          </a>
        </div>
        <div className="item-list">
          <Link to={{pathname: `${BASENAME}topic`, state: {id: "abc"}}}>
            <div className="icon ion-list"></div>
            <span className="text">预订</span>
          </Link>
        </div>
        <div className="item-community active">
          <Link to={{pathname: `${BASENAME}community`}}>
            <div className="icon ion-community-active"></div>
            <span className="text">社区</span>
          </Link>
        </div>
        <div className="item-user">
          <Link to={{pathname: `${BASENAME}user/times`}}>
            <div className="icon ion-user"></div>
            <span className="text">我的</span>
          </Link>
        </div>
      </div>
    )
  }
}

export default TabBar;