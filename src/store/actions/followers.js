export const GET_VENUES_FOLLOWERS_LOADING = "GET_VENUES_FOLLOWERS_LOADING";
export const GET_VENUES_FOLLOWERS_FAIL = "GET_VENUES_FOLLOWERS_FAIL";
export const SET_VENUES_FOLLOWERS = "SET_VENUES_FOLLOWERS";

export const GET_USER_FOLLOWERS_LOADING = "GET_USER_FOLLOWERS_LOADING";
export const GET_USER_FOLLOWERS_FAIL = "GET_USER_FOLLOWERS_FAIL";
export const SET_USER_FOLLOWERS = "SET_USER_FOLLOWERS";

export const GET_OFFICIAL_ACCOUNT_LOADING = "GET_OFFICIAL_ACCOUNT_LOADING";
export const GET_OFFICIAL_ACCOUNT_FAIL = "GET_OFFICIAL_ACCOUNT_FAIL";
export const SET_OFFICIAL_ACCOUNT = "SET_OFFICIAL_ACCOUNT";


/*********** */

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

/*********** */

export const getOfficialAccountLoging = newState => ({
    type: GET_OFFICIAL_ACCOUNT_LOADING,
    newState
});

export const getOfficialAccountFail = newState => ({
    type: GET_OFFICIAL_ACCOUNT_FAIL,
    newState
});

export const setOfficialAccount = newState => ({
    type: SET_OFFICIAL_ACCOUNT,
    newState
});
