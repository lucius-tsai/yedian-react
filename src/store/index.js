import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';
import logger from 'redux-logger'
import reducers from './reducers'

let middleware = [thunk, logger];

const init = (history) => {
    return createStore(
        connectRouter(history)(reducers),
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        compose(
            applyMiddleware(
                routerMiddleware(history),
                ...middleware
            ),
        ),
    )
}

export default init;
