export const LOAD_ADDENDA = 'EvtX:Server:addenda:load';
export const ADDENDA_LOADED = 'addenda:loaded';
export const ADD_ADDENDUM = 'EvtX:Server:addenda:add';
export const ADDENDUM_ADDED = 'addendum:added';
export const UPDATE_ADDENDUM = 'EvtX:Server:addenda:update';
export const ADDENDUM_UPDATED = 'addendum:updated';
export const DELETE_ADDENDUM = 'EvtX:Server:addenda:del';
export const ADDENDUM_DELETED = 'addendum:deleted';

export const loadAddenda = () => (dispatch, getState) => {
  dispatch({
    type: LOAD_ADDENDA,
    replyTo: ADDENDA_LOADED,
  });
};

export const addAddendum = newAddendum => dispatch => {
  dispatch({
    type: ADD_ADDENDUM,
    payload: newAddendum,
    replyTo: ADDENDUM_ADDED,
  });
};

export const updateAddendum = newAddendum => dispatch => {
  dispatch({
    type: UPDATE_ADDENDUM,
    payload: newAddendum,
    replyTo: ADDENDUM_UPDATED,
  });
};

export const deleteAddendum = id => dispatch => {
  dispatch({
    type: DELETE_ADDENDUM,
    payload: { _id: id },
    replyTo: ADDENDUM_DELETED,
  });
};
