import React from 'react';
import ReactDOM from 'react-dom';
import App from './main';

const MOUNT_NODE = document.getElementById('app');

let render = () => {
  const routes = require('./router/index').default();
  ReactDOM.render(
    <App routes={routes} />,
    MOUNT_NODE
  )
};

render();