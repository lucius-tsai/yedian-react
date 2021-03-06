import {
    APP_REQUEST_LOADING,
    APP_REQUEST_SUCCESS,
    APP_REQUEST_FAIL,
    APP_HIDE_BAR,
    APP_SHOW_BAR,
    APP_UNMOUNT_DELETE,
    APP_SET_GPS,
    APP_HANDLE_SCROLL_LOADING,
    APP_HANDLE_SCROLL_DOWN
} from '../actions/appStatus';

const appStatus = (state = { loading: false }, action) => {
    // console.log(action);
    switch (action.type) {
        case APP_REQUEST_LOADING:
            return {
                ...state, loading: true
            }
        case APP_REQUEST_SUCCESS:
            return {
                ...state, loading: false
            }
        case APP_REQUEST_FAIL:
            return {
                ...state, loading: false
            }
        case APP_HIDE_BAR:
            return {
                ...state, hideBar: true
            }
        case APP_SHOW_BAR:
            return {
                ...state, hideBar: false
            }
        case APP_UNMOUNT_DELETE:
            return {
                ...state, Unmount: true
            }
        case APP_SET_GPS:
            return {
                ...state, gps: action.newState
            }
        case APP_HANDLE_SCROLL_LOADING:
            return {
                ...state, scrollLoading: true
            }
        case APP_HANDLE_SCROLL_DOWN:
            return {
                ...state, scrollLoading: false
            }
        default:
            return state
    }
}

export default appStatus;

