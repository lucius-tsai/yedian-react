import {
	PUBLISH_VENUES_ADD,
	PUBLISH_VENUES_DELETE,
	PUBLISH_TAG_ADD,
	PUBLISH_TAG_DELETE,
	PUBLISH_PICTURES_ADD,
	PUBLISH_PICTURES_DELETE,
	PUBLISH_DELETE,
	PUBLISH_DESCRIPTION_SAVE
} from '../actions/publish';

const publish = (state = {}, action) => {
	// console.log(action);
	switch (action.type) {
		case PUBLISH_VENUES_ADD:
			return {
				...state, venues: action.newState.cell
			}
		case PUBLISH_VENUES_DELETE:
			return {
				...state, venues: null
			}
		case PUBLISH_TAG_ADD:
			return {
				...state, tags: action.newState
			}
		case PUBLISH_TAG_DELETE:
			return {
				...state, tags: action.newState
			}
		case PUBLISH_PICTURES_ADD:
			return {
				...state, pictures: action.newState
			}
		case PUBLISH_PICTURES_DELETE:
			return {
				...state, pictures: []
			}
		case PUBLISH_DELETE:
			return {
				...state, venues: null, tags: null, description: '', pictures: []
			}
		case PUBLISH_DESCRIPTION_SAVE:
			return {
				...state, description: action.newState
			}
		default:
			return state
	}
}

export default publish;