import {
	PUBLISH_VENUES_ADD,
	PUBLISH_VENUES_DELETE,
	PUBLISH_TOPIC_ADD,
	PUBLISH_TOPIC_DELETE,
	PUBLISH_PICTURES_ADD,
	PUBLISH_PICTURES_DELETE,
	PUBLISH_DELETE
} from '../actions/publish';

const publish = (state = {}, action) => {
	console.log(action);
	switch (action.type) {
		case PUBLISH_VENUES_ADD:
			return {
				...state, venues: action.newState.cell
			}
		case PUBLISH_VENUES_DELETE:
			return {
				...state, venues: null
			}
		case PUBLISH_TOPIC_ADD:
			return {
				...state, topic: action.newState.cell
			}
		case PUBLISH_TOPIC_DELETE:
			return {
				...state, topic: null
			}
		case PUBLISH_PICTURES_ADD:
			return {
				...state, pictures: action.newState
			}
		case PUBLISH_TOPIC_DELETE:
			return {
				...state, pictures: action.newState
			}
		case PUBLISH_DELETE:
			return {
				...state, venues: null, topic: null
			}
		default:
			return state
	}
}

export default publish;