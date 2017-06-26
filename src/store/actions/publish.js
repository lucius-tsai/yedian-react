export const PUBLISH_VENUES_ADD = "PUBLISH_VENUES_ADD";
export const PUBLISH_VENUES_DELETE = "PUBLISH_VENUES_DELETE";

export const PUBLISH_TOPIC_ADD = "PUBLISH_TOPIC_ADD";
export const PUBLISH_TOPIC_DELETE = "PUBLISH_TOPIC_DELETE";

export const PUBLISH_PICTURES_ADD = "PUBLISH_PICTURES_ADD";
export const PUBLISH_PICTURES_DELETE = "PUBLISH_PICTURES_DELETE";

export const PUBLISH_DELETE = "PUBLISH_DELETE";


export const addTopic = newState => ({
    type: PUBLISH_TOPIC_ADD,
    newState
});

export const addVenues = newState => ({
    type: PUBLISH_VENUES_ADD,
    newState
});

export const addPictures = newState => ({
    type: PUBLISH_PICTURES_ADD,
    newState
});