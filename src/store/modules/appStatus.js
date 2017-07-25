/**
 * 
 */

const APP_REQUEST_LOADING = "APP_REQUEST_LOADING";
const APP_REQUEST_SUCCESS = "APP_REQUEST_SUCCESS";
const APP_REQUEST_FAIL = "APP_REQUEST_FAIL";

const APP_HANDLE_SCROLL_LOADING = "APP_HANDLE_SCROLL_LOADING";
const APP_HANDLE_SCROLL_DOWN = "APP_HANDLE_SCROLL_DOWN";

const APP_HIDE_BAR = "APP_HIDE_BAR";
const APP_SHOW_BAR = "APP_SHOW_BAR";

const APP_HIDE_COMMENT = "APP_HIDE_COMMENT";
const APP_SHOW_COMMENT = "APP_SHOW_COMMENT";

const APP_SET_GPS = "APP_SET_GPS";

const initialState = {
  loading: false
};


const appStatus = (state = initialState, action) => {
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
        case APP_SHOW_COMMENT:
            return {
                ...state, showComment: true
            }
        case APP_HIDE_COMMENT:
            return {
                ...state, showComment: false
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






export const loading = state => ({
	type: APP_REQUEST_LOADING,
	state
});

export const loadSuccess = state => ({
	type: APP_REQUEST_SUCCESS,
	state
});

export const loadFail = state => ({
	type: APP_REQUEST_FAIL,
	state
});

export const showBar = state => ({
	type: APP_SHOW_BAR,
	state
});

export const hideBar = state => ({
	type: APP_HIDE_BAR,
	state
});

export const setLocation = newState => ({
	type: APP_SET_GPS,
	newState
});

export const showComment = newState => ({
	type: APP_SHOW_COMMENT,
	newState
});

export const hiddenComment = newState => ({
	type: APP_HIDE_COMMENT,
	newState
});

export const showScrollLoading = newState => ({
	type: APP_HANDLE_SCROLL_LOADING,
	newState
});

export const hiddenScrollLoading = newState => ({
	type: APP_HANDLE_SCROLL_DOWN,
	newState
});