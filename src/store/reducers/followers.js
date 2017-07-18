import {
	SET_VENUES_FOLLOWERS,
	SET_USER_FOLLOWERS
} from '../actions/followers';

const publish = (state = {}, action) => {
	// console.log(action);
	switch (action.type) {
		case SET_VENUES_FOLLOWERS:
			return {
				...state, venuesFollowers: action.newState
			}
		case SET_USER_FOLLOWERS:
			return {
				...state, userFollowers: action.newState
			}
		default:
			return state
	}
}

export default publish;