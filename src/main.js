'use strict';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { routerMiddleware, connectRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'connected-react-router'

import {
  BrowserRouter as Router
} from 'react-router-dom';

import { weChatSDKInstall } from './libs/wechat';
import { os } from './libs/uitls';
import { getWeChatSDKSign } from './libs/api';
import Bootstrap from './router/AppStart/';
import createStore from './store';

const history = createHistory();

/**
 * listen route change
 */
history.listen(location => {
  // pushState需要重新配置微信SDK
  if (os.isAndroid) {
    alert("debug-route-change-sign-sdk");
    sdk();
  }
});

const store = createStore(history);
class App extends Component {
  // shouldComponentUpdate() {
  //   return true;
  // }
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history} basename={BASENAME}>
          <Bootstrap />
        </ConnectedRouter>
      </Provider>
    )
  }
}

const sdk = () => {
  getWeChatSDKSign().then(res => {
    if (res.code === 200 && typeof wx !== "undefined") {
      alert("debug-http-sdk-success");
      weChatSDKInstall(res.data);
    }
  }, error => {
  });
}

export default App;