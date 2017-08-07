import {
	GET_VENUES_FOLLOWERS_LOADING,
	GET_VENUES_FOLLOWERS_FAIL,
	SET_VENUES_FOLLOWERS,
	GET_USER_FOLLOWERS_LOADING,
	GET_USER_FOLLOWERS_FAIL,
	SET_USER_FOLLOWERS,
	GET_OFFICIAL_ACCOUNT_LOADING,
	GET_OFFICIAL_ACCOUNT_FAIL,
	SET_OFFICIAL_ACCOUNT
} from '../actions/followers';

const followers = (state = {venuesFollowers: null, userFollowers: null}, action) => {
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
		case GET_OFFICIAL_ACCOUNT_LOADING:
			return {
				...state, loadingofficialAccount: true
			}
		case GET_OFFICIAL_ACCOUNT_FAIL:
			return {
				...state, loadingofficialAccount: false
			}
		case SET_OFFICIAL_ACCOUNT:
			return {
				...state, officialAccount: action.newState, loadingofficialAccount: false
			}
		default:
			return state
	}
}

export default followers;