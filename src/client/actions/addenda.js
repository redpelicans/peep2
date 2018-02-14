export const ADD_ADDENDUM = 'EvtX:Server:addenda:add';
export const ADDENDUM_ADDED = 'addendum:added';

export const addAddendum = newAddendum => dispatch => {
  dispatch({
    type: ADD_ADDENDUM,
    payload: newAddendum,
    replyTo: ADDENDUM_ADDED,
  });
};
