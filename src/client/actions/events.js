export const LOAD_EVENTS = 'EvtX:Server:events:load';
export const EVENTS_LOADED = 'events:loaded';

export const loadEvents = ({ from, to }) => dispatch => {
  const payload = { from: from && +from, to: to && +to };
  dispatch({ type: LOAD_EVENTS, payload, replyTo: EVENTS_LOADED });
};

export const loadEventGroup = ({ groupId }) => dispatch => {
  const payload = { groupId };
  const promise = new Promise((resolve, reject) => {
    const getEventGroup = x =>
      console.log('-------------------------------------------------- CB');
    dispatch({
      type: LOAD_EVENTS,
      payload,
      replyTo: EVENTS_LOADED,
      callback: getEventGroup,
    });
  });
  return promise;
};

export default { loadEvents };