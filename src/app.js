import "babel-polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import App from './main';

import { cookie, getQueryString } from './libs/uitls';
import { weChatSDKInstall } from './libs/wechat';
import { weChatAuth, getWeChatSDKSign, getScripts } from './libs/api';
// const currentPage = window.location.pathname;

/**
 * sensorsdata[神策监测代码]
 */
// if(process.env.NODE_ENV !== 'localhost') {
const __API = process.env.NODE_ENV === 'production' ? '//yd-data.chinacloudapp.cn:8006/sa?project=production' : '//yd-data.chinacloudapp.cn:8006/sa';
(function (para) {
  var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
  w['sensorsDataAnalytic201505'] = n;
  w[n] = w[n] || function (a) { return function () { (w[n]._q = w[n]._q || []).push([a, arguments]); } };
  var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'clearAllRegister', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout'];
  for (var i = 0; i < ifs.length; i++) {
    w[n][ifs[i]] = w[n].call(null, ifs[i]);
  }
  if (!w[n]._t) {
    x = d.createElement(s), y = d.getElementsByTagName(s)[0];
    x.async = 1;
    x.src = p;
    y.parentNode.insertBefore(x, y);
    w[n].para = para;
  }
})({
  sdk_url: process.env.NODE_ENV !== 'localhost' ? `${location.origin}${BASENAME}static/sensorsdata.min.js` : `//staging-app.ye-dian.com${BASENAME}static/sensorsdata.min.js`,
  name: 'sa',
  server_url: __API
});
// }

const MOUNT_NODE = document.getElementById('app');
const isWechat = !!(/micromessenger|webbrowser/i).test(navigator.userAgent);

let render = () => {
  // const routes = require('./router/index').default();
  setTimeout(() => {
    ReactDOM.render(
      <App />,
      MOUNT_NODE
    )
  }, 1000);
};

const sdk = () => {
  getWeChatSDKSign().then(res => {
    if (res.code === 200 && typeof wx !== "undefined") {
      weChatSDKInstall(res.data);
    }
  }, error => {
  });
}

if (isWechat) {
  if (typeof wx !== 'undefined') {
    sdk()
  } else {
    const body = document.getElementsByTagName('body')[0];
    const wxScriptDom = document.createElement('script');
    // wxScriptDom.setAttribute('src', '//res.wx.qq.com/open/js/jweixin-1.2.0.js');
    wxScriptDom.setAttribute('src', `${location.origin}${BASENAME}static/jweixin-1.2.0.js`);
    wxScriptDom.addEventListener('load', () => {
      sdk();
    });
    body.appendChild(wxScriptDom);
  }
}

if (process.env.NODE_ENV === 'localhost') {
  render();
} else {
  /**
   * wechat login by auth
   */
  const token = cookie('js_session');
  if (!token) {
    const queryToken = getQueryString('token');
    let authCount = !cookie('auth_count') ? 0 : cookie('auth_count');
    if (!isWechat) {
      render();
    } else {
      if (!queryToken && authCount < 1) {
        cookie('auth_count', authCount * 1 + 1, { path: '/', expires: 7 });
        weChatAuth()
      } else if (queryToken) {
        cookie('js_session', queryToken, { path: '/', expires: 7 });
        render();
        // location.replace((location.hash.indexOf("?") > 0 ? "&" : "?") + location.search.substring(1));
      } else {
        render();
        cookie('auth_count', null);
      }
    }
  } else {
    render();
  }
}

// (() => {
//   const body = document.getElementsByTagName('body')[0];
//   const fastClickScriptDom = document.createElement('script');
//   const url = process.env.NODE_ENV !== 'localhost' ? `${location.origin}${BASENAME}static/fastclick.js` : `//staging-app.ye-dian.com${BASENAME}static/fastclick.js`;
//   fastClickScriptDom.setAttribute('src', url);
//   fastClickScriptDom.addEventListener('load', () => {
//     window.FastClick.attach(document.body);
//   });
//   body.appendChild(fastClickScriptDom);
// })();
