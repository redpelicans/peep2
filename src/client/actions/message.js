export const DANGER = 'DANGER';
export const SUCCESS = 'SUCCESS';
export const PRIMARY = 'PRIMARY';
export const WARNING = 'WARNING';
export const ADD_ALERT = 'MESSAGES:ADD_ALERT';

export const addAlert = ({ type, message, description }) => ({
  type: ADD_ALERT,
  payload: { type, message, description },
});

export default { addAlert };
