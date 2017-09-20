import { isEmpty } from "ramda";

export const LOAD_EVENTS = "EvtX:Server:events:load";
export const EVENTS_LOADED = "events:loaded";

export const loadEvents = () => (dispatch, getState) => {
  const { events: { data } } = getState();
  if (isEmpty(data)) {
    dispatch({
      type: LOAD_EVENTS,
      replyTo: EVENTS_LOADED
    });
  }
};

export default { loadEvents };
