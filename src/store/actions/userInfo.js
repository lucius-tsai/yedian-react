export const GET_USER_INFO_REQUEST = "GET_USER_INFO_REQUEST";
export const GET_USER_INFO_SUCCESS = "GET_USER_INFO_SUCCESS";
export const GET_USER_INFO_FAIL = "GET_USER_INFO_FAIL";

export const getUserInfoLoading = newState => ({
    type: GET_USER_INFO_REQUEST,
    newState
});

export const getUserInfoSuccess = newState => ({
    type: GET_USER_INFO_SUCCESS,
    newState
});