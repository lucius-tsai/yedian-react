import {
	GET_VENUES_FOLLOWERS_LOADING,
	GET_VENUES_FOLLOWERS_FAIL,
	SET_VENUES_FOLLOWERS,
	GET_USER_FOLLOWERS_LOADING,
	GET_USER_FOLLOWERS_FAIL,
	SET_USER_FOLLOWERS
} from '../actions/followers';

const publish = (state = {venuesFollowers: null, userFollowers: null}, action) => {
	// console.log(action);
	switch (action.type) {
		case GET_VENUES_FOLLOWERS_LOADING:
			return {
				...state, loadingVenuesFollowers: true
			}
		case GET_VENUES_FOLLOWERS_FAIL:
			return {
				...state, loadingVenuesFollowers: false
			}
		case SET_VENUES_FOLLOWERS:
			return {
				...state, venuesFollowers: action.newState, loadingVenuesFollowers: false
			}
		case GET_USER_FOLLOWERS_LOADING:
			return {
				...state, loadingUserFollowers: true
			}
		case GET_USER_FOLLOWERS_FAIL:
			return {
				...state, loadingUserFollowers: false
			}
		case SET_USER_FOLLOWERS:
			return {
				...state, userFollowers: action.newState, loadingUserFollowers: false
			}
		default:
			return state
	}
}

export default publish;