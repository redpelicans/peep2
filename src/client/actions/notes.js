export const LOAD_NOTES = 'EvtX:Server:notes:load';
export const NOTE_ADDED = 'note:added';
export const NOTES_LOADED = 'notes:loaded';
export const FILTER_NOTES_LIST = 'filter:notes:list';
export const SORT_NOTES_LIST = 'sort:notes:list';
export const DELETE_NOTES = 'EvtX:Server:notes:del';
export const NOTES_DELETED = 'notes:deleted';
export const ADD_NOTES = 'EvtX:Server:notes:add';
export const NOTES_ADDED = 'notes:added';

export const filterNotesList = filter => ({
  type: FILTER_NOTES_LIST,
  filter,
});

export const sortNotesList = sortBy => ({ type: SORT_NOTES_LIST, sortBy });

export const loadNotes = () => (dispatch, getState) => {
  const { notes } = getState();
  if (!notes.data.length) {
    dispatch({
      type: LOAD_NOTES,
      replyTo: NOTES_LOADED,
    });
  }
};

export const deleteNote = id => dispatch => {
  dispatch({
    type: DELETE_NOTES,
    payload: { _id: id },
    replyTo: NOTES_DELETED,
  });
};

export const addNote = (id, note, entityType) => dispatch => {
  dispatch({
    type: ADD_NOTES,
    payload: { entityType, entityId: id, content: note },
    replyTo: NOTES_ADDED,
  });
};
