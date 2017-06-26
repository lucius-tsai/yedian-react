import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import appStatus from './appStatus';
import publish from './publish';

export default combineReducers({
    appStatus,
    publish
});