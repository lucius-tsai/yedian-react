// export const GET_POSTS_LIST_REQUEST = "GET_POSTS_LIST_REQUEST";
// export const GET_POSTS_LIST_SUCCESS = "GET_POSTS_LIST_SUCCESS";
// export const GET_POSTS_LIST_FAIL = "GET_POSTS_LIST_FAIL";

export const SET_POST_LIST_NULL = "SET_POST_LIST_NULL";

export const PUT_POST_LIST = "PUT_POST_LIST";

// export const GET_USER_INFO_REQUEST = "GET_USER_INFO_REQUEST";
// export const GET_USER_INFO_SUCCESS = "GET_USER_INFO_SUCCESS";
// export const GET_USER_INFO_FAIL = "GET_USER_INFO_FAIL";

export const putPostList = newState => ({
    type: PUT_POST_LIST,
    newState
});

export const resetPostList = newState => ({
    type: SET_POST_LIST_NULL,
    newState
});
  