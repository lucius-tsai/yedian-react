import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import style from './tabBar.scss';
import styleIcons from  "../../icons/scss/ionicons";
import styleBase from "../../assets/scss/base";

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
  constructor(props) {
    super(props)
    this.state = {
      hide: this.props.hidden
    }
  }
  componentWillReceiveProps(nextProps) {
    const { hidden } = nextProps;
    this.setState({
      hide: hidden
    });
  }

  render() {
    const { hide } = this.state;
    const cellWidth = window.innerWidth > 414 ? 414 : window.innerWidth;
    return (
      <div className={!hide ? `${style.tabBar} ${style.show}` : style.tabBar} style={{ width: cellWidth, marginLeft: `-${cellWidth / 2}px` }}>
        <div>
          <a href={`${domain}${query}`}>
            <div className={styleIcons["ion-index"]} data-icon></div>
            <span className={style.text}>精选</span>
          </a>
        </div>
        <div>
          <a href={`${domain}list/ktv${query}`}>
            <div className={styleIcons["ion-list"]} data-icon></div>
            <span className={style.text}>预订</span>
          </a>
        </div>
        <div className={style.active}>
          {
            window.location.pathname !== `${BASENAME}community` ? <Link to={{ pathname: `${BASENAME}community` }}>
              <div className={styleIcons["ion-community-active"]} data-icon></div>
              <span className={style.text}>社区</span>
            </Link>
              : <a href="javascript:;">
                <div className={styleIcons["ion-community-active"]} data-icon></div>
                <span className={style.text}>社区</span>
              </a>
          }
        </div>
        <div>
          <a href={`${domain}user${query}`}>
            <div className={styleIcons["ion-user"]} data-icon></div>
            <span className={style.text}>我的</span>
          </a>
        </div>
      </div>
    )
  }
}

export default TabBar;