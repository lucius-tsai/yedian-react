export const APP_REQUEST_LOADING = "APP_REQUEST_LOADING";
export const APP_REQUEST_SUCCESS = "APP_REQUEST_SUCCESS";
export const APP_REQUEST_FAIL = "APP_REQUEST_FAIL";

export const APP_HANDLE_SCROLL_LOADING = "APP_HANDLE_SCROLL_LOADING";
export const APP_HANDLE_SCROLL_DOWN = "APP_HANDLE_SCROLL_DOWN";

export const APP_HIDE_BAR = "APP_HIDE_BAR";
export const APP_SHOW_BAR = "APP_SHOW_BAR";

export const APP_HIDE_COMMENT = "APP_HIDE_COMMENT";
export const APP_SHOW_COMMENT = "APP_SHOW_COMMENT";

export const APP_SET_GPS = "APP_SET_GPS";

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