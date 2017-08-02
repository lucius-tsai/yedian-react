import { combineReducers } from 'redux';

import appStatus from './appStatus';
import publish from './publish';
import userInfo from './userInfo';
import followers from './followers';
import posts from './posts';

export default combineReducers({
    appStatus,
    publish,
    userInfo,
    followers,
    posts
});