import React from 'react';
import ReactDOM from 'react-dom';
import App from './main';

import { cookie, getQueryString, weChatSDKInstall, getLocation } from './libs/uitls';
import { weChatAuth, getWeChatSDKSign, getScripts } from './libs/api';

const MOUNT_NODE = document.getElementById('app');
const isWechat = !!(/micromessenger|webbrowser/i).test(navigator.userAgent);

let render = () => {
  const routes = require('./router/index').default();
  ReactDOM.render(
    <App routes={routes} />,
    MOUNT_NODE
  )
};

const sdk = () => {
  getWeChatSDKSign().then(res => {
    if (res.code === 200 && typeof wx !== "undefined") {
      weChatSDKInstall(res.data);
    }
  }, error => {
  });
}

// getLocation().then(res => {
//   console.log(res);
// }, error => {
//   console.log(error)
// })

if (isWechat) {
  if (typeof wx !== "undefined") {
    sdk()
  } else {
    const body = document.getElementsByTagName('body')[0];
    const wxScriptDom = document.createElement('script');
    wxScriptDom.setAttribute('src', '//res.wx.qq.com/open/js/jweixin-1.2.0.js');
    wxScriptDom.addEventListener('load', () => {
      sdk();
    });
    body.appendChild(wxScriptDom);
  }
}

if (process.env.NODE_ENV === "localhost") {
  render();
} else {
  /**
   * wechat login by auth
   */
  const token = cookie('js_session');
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

