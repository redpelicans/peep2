import { reduce } from 'ramda';
import { startOfMonth, endOfMonth } from 'date-fns';
import { alert, DANGER } from './message';
export const LOAD_EVENTS = 'EvtX:Server:events:load';
export const ADD_EVENT_GROUP = 'EvtX:Server:events:addEventGroup';
export const DEL_EVENT_GROUP = 'EvtX:Server:events:delEventGroup';
export const UPDATE_EVENT_GROUP = 'EvtX:Server:events:updateEventGroup';
export const EVENTS_LOADED = 'events:loaded';
export const EVENTS_ADDED = 'events:added';
export const EVENTS_DELETED = 'events:deleted';

export const loadEvents = ({ from, to }) => dispatch => {
  const payload = { from: from && +from, to: to && +to };
  dispatch({ type: LOAD_EVENTS, payload, replyTo: EVENTS_LOADED });
};

export const minValue = (a, b) => (a ? (a < b ? a : b) : b);
export const maxValue = (a, b) => (a ? (b > a ? b : a) : b);

export const loadEventGroup = ({ groupId }) => dispatch => {
  const payload = { groupId };
  const getEventGroup = (err, groupedEvents) => {
    if (err) return dispatch(alert({ type: DANGER, message: err.message }));
    const getEvents = (err, events) => {
      if (err) return dispatch(alert({ type: DANGER, message: err.message }));
      dispatch({ type: EVENTS_LOADED, payload: [...groupedEvents, ...events] });
    };
    const [from, to] = reduce(
      ([min, max], e) => [minValue(min, e.from), maxValue(max, e.to)],
      [],
      groupedEvents,
    );
    dispatch({
      type: LOAD_EVENTS,
      payload: { from: +startOfMonth(from), to: +endOfMonth(to) },
      callback: getEvents,
    });
  };
  dispatch({
    type: LOAD_EVENTS,
    payload,
    callback: getEventGroup,
  });
};

export const addEventGroup = payload => ({
  type: ADD_EVENT_GROUP,
  payload,
  replyTo: EVENTS_ADDED,
});

export const delEventGroup = ({ groupId }) => ({
  type: DEL_EVENT_GROUP,
  payload: { groupId },
  replyTo: EVENTS_DELETED,
});

export const updateEventGroup = ({ previous, next }) => {
  const payload = {
    groupId: previous.groupId,
    ...next,
  };
  return {
    type: UPDATE_EVENT_GROUP,
    payload,
    replyTo: EVENTS_ADDED,
  };
};

export default { loadEvents };
