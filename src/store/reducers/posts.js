import {
	SET_POST_LIST_NULL,
	PUT_POST_LIST
} from '../actions/posts';

const publish = (state = {}, action) => {
	// console.log(action);
	switch (action.type) {
		case PUT_POST_LIST:
			return {
				...state, posts: action.newState
			}
		case SET_POST_LIST_NULL:
			return {
				...state, posts: []
			}
		default:
			return state
	}
}

export default publish;