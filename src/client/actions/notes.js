export const LOAD_NOTES = 'EvtX:Server:notes:load';
export const DELETE_NOTE = 'EvtX:Server:notes:del';
export const NOTE_ADDED = 'note:added';
export const NOTES_LOADED = 'notes:loaded';
export const FILTER_NOTES_LIST = 'filter:notes:list';
export const SORT_NOTES_LIST = 'sort:notes:list';
export const NOTES_DELETED = 'notes:deleted';
export const ADD_NOTE = 'EvtX:Server:notes:add';
export const NOTE_UPDATED = 'note:updated';
export const UPDATE_NOTE = 'EvtX:Server:notes:update';
export const NOTE_DELETED = 'note:deleted';

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
    type: DELETE_NOTE,
    payload: { _id: id },
    replyTo: NOTE_DELETED,
  });
};

export const addNote = (id, note, entityType) => dispatch => {
  dispatch({
    type: ADD_NOTE,
    payload: { entityType, entityId: id, content: note },
    replyTo: NOTE_ADDED,
  });
};

export const updateNote = (id, note, entityType) => dispatch => {
  dispatch({
    type: UPDATE_NOTE,
    payload: { entityType, _id: id, content: note, newNote: '' },
    replyTo: NOTE_UPDATED,
  });
};
