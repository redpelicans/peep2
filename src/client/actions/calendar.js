export const LOAD_CALENDAR = 'EvtX:Server:calendar:load';
export const CALENDAR_LOADED = 'calendar:loaded';

export const loadCalendar = () => dispatch => {
  dispatch({
    type: LOAD_CALENDAR,
    replyTo: CALENDAR_LOADED,
  });
};
