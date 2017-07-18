export const SET_VENUES_FOLLOWERS = "SET_VENUES_FOLLOWERS";
export const SET_USER_FOLLOWERS = "SET_USER_FOLLOWERS";

export const setVenuesFollowers = newState => ({
    type: SET_VENUES_FOLLOWERS,
    newState
});

export const setUserFollowers = newState => ({
    type: SET_USER_FOLLOWERS,
    newState
});