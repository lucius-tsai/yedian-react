import React from 'react';
import ReactDOM from 'react-dom';
import App from './main';

import { cookie, getQueryString } from './libs/uitls';
import { weChatAuth } from './libs/api';

const MOUNT_NODE = document.getElementById('app');

let render = () => {
  const routes = require('./router/index').default();
  ReactDOM.render(
    <App routes={routes} />,
    MOUNT_NODE
  )
};



if (process.env.NODE_ENV === "localhost") {
  render();
} else {
  /**
   * wechat login by auth
   */
  const token = cookie('js_session');
  const isWechat = !!(/micromessenger|webbrowser/i).test(navigator.userAgent);
  if (!token) {
    const queryToken = getQueryString("token");
    let authCount = !cookie("auth_count") ? 0 : cookie("auth_count");
    if (!isWechat) {
      render();
    }
    if (!queryToken && authCount < 1) {
      cookie("auth_count", authCount * 1 + 1, { path: '/', expires: 7 });
      weChatAuth()
    } else if (queryToken) {
      cookie("js_session", queryToken, { path: '/', expires: 7 });
      render();
      // location.replace((location.hash.indexOf("?") > 0 ? "&" : "?") + location.search.substring(1));
    } else {
      render();
      cookie("auth_count", null);
    }
  } else {
    render();
  }
}

