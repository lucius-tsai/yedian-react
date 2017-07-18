import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import appStatus from './appStatus';
import publish from './publish';
import userInfo from './userInfo';
import followers from './followers';

export default combineReducers({
    appStatus,
    publish,
    userInfo,
    followers
});