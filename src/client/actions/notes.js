export const LOAD_NOTES = 'EvtX:Server:notes:load';
export const NOTES_LOADED = 'notes:loaded';
export const FILTER_NOTES_LIST = 'filter:notes:list';

export const filterNotesList = filter => ({
  type: FILTER_NOTES_LIST,
  filter,
});

export const loadNotes = () => (dispatch, getState) => {
  const { notes } = getState();
  if (!notes.data.length) {
    dispatch({
      type: LOAD_NOTES,
      replyTo: NOTES_LOADED,
    });
  }
};
