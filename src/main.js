'use strict';
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {routerMiddleware, connectRouter} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import {ConnectedRouter} from 'connected-react-router'

import {
  BrowserRouter as Router
} from 'react-router-dom';

import Bootstrap from './router/AppStart/';

const history = createHistory();

import createStore from './store';

const store = createStore(history);

class App extends Component {

  shouldComponentUpdate() {
    return true;
  }

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

export default App;