import { isEmpty } from 'ramda';

export const LOAD_MISSIONS = 'EvtX:Server:missions:load';
export const MISSIONS_LOADED = 'missions:loaded';

export const loadMissions = () => (dispatch, getState) => {
  const { people } = getState();
  if (isEmpty(people.data)) {
    dispatch({
      type: LOAD_MISSIONS,
      replyTo: MISSIONS_LOADED,
    });
  }
};
