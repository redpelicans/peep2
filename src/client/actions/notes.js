export const LOAD_NOTES = 'EvtX:Server:notes:load';
export const NOTE_ADDED = 'note:added';
export const NOTES_DELETED = 'notes:deleted';
export const NOTES_LOADED = 'notes:loaded';
export const FILTER_NOTES_LIST = 'filter:notes:list';
export const SORT_NOTES_LIST = 'sort:notes:list';

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
