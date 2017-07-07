import {
	GET_USER_INFO_REQUEST,
	GET_USER_INFO_SUCCESS,
	GET_USER_INFO_FAIL
} from '../actions/userInfo';

const publish = (state = {}, action) => {
	console.log(action);
	switch (action.type) {
		case GET_USER_INFO_REQUEST:
			return {
				...state, user: null, loading: true
			}
		case GET_USER_INFO_SUCCESS:
			return {
				...state, user: action.newState, loading: false
			}
		case GET_USER_INFO_FAIL:
			return {
				...state, user: null, loading: false
			}
		default:
			return state
	}
}

export default publish;