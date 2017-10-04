export const DANGER = 'DANGER';
export const SUCCESS = 'SUCCESS';
export const PRIMARY = 'PRIMARY';
export const WARNING = 'WARNING';
export const ALERT = 'MESSAGES:ALERT';
export const EVTX_ERROR = 'EvtX:Error';

export const alert = ({ type, message, description }) => ({
  type: ALERT,
  payload: { type, message, description },
});

export default { alert };
