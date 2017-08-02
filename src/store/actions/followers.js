export const GET_VENUES_FOLLOWERS_LOADING = "GET_VENUES_FOLLOWERS_LOADING";
export const GET_VENUES_FOLLOWERS_FAIL = "GET_VENUES_FOLLOWERS_FAIL";
export const SET_VENUES_FOLLOWERS = "SET_VENUES_FOLLOWERS";

export const GET_USER_FOLLOWERS_LOADING = "GET_USER_FOLLOWERS_LOADING";
export const GET_USER_FOLLOWERS_FAIL = "GET_USER_FOLLOWERS_FAIL";
export const SET_USER_FOLLOWERS = "SET_USER_FOLLOWERS";


export const getVenuesFollowers = newState => ({
    type: GET_VENUES_FOLLOWERS_LOADING,
    newState
});

export const getVenuesFollowersFail = newState => ({
    type: GET_VENUES_FOLLOWERS_FAIL,
    newState
});

export const setVenuesFollowers = newState => ({
    type: SET_VENUES_FOLLOWERS,
    newState
});

/*********** */

export const getUserFollowers = newState => ({
    type: GET_USER_FOLLOWERS_LOADING,
    newState
});

export const getUserFollowersFail = newState => ({
    type: GET_USER_FOLLOWERS_FAIL,
    newState
});

export const setUserFollowers = newState => ({
    type: SET_USER_FOLLOWERS,
    newState
});
