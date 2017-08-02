export const PUBLISH_VENUES_ADD = "PUBLISH_VENUES_ADD";
export const PUBLISH_VENUES_DELETE = "PUBLISH_VENUES_DELETE";

export const PUBLISH_TAG_ADD = "PUBLISH_TAG_ADD";
export const PUBLISH_TAG_DELETE = "PUBLISH_TAG_DELETE";

export const PUBLISH_PICTURES_ADD = "PUBLISH_PICTURES_ADD";
export const PUBLISH_PICTURES_DELETE = "PUBLISH_PICTURES_DELETE";

export const PUBLISH_DELETE = "PUBLISH_DELETE";
export const PUBLISH_DESCRIPTION_SAVE = "PUBLISH_DESCRIPTION_SAVE";


export const addTag = newState => ({
    type: PUBLISH_TAG_ADD,
    newState
});

export const removeTag = newState => ({
    type: PUBLISH_TAG_DELETE,
    newState
});

export const addVenues = newState => ({
    type: PUBLISH_VENUES_ADD,
    newState
});

export const removeVenues = newState => ({
    type: PUBLISH_VENUES_DELETE,
    newState
});

export const addPictures = newState => ({
    type: PUBLISH_PICTURES_ADD,
    newState
});

export const saveDescription = newState => ({
    type: PUBLISH_DESCRIPTION_SAVE,
    newState
});

export const delAll = newState => ({
    type: PUBLISH_DELETE,
    newState
});