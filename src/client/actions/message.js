export const DANGER = 'DANGER';
export const SUCCESS = 'SUCCESS';
export const PRIMARY = 'PRIMARY';
export const WARNING = 'WARNING';
export const ALERT = 'MESSAGES:ALERT';

export const alert = ({ type, message, description }) => ({
  type: ALERT,
  payload: { type, message, description },
});

export default { alert };
