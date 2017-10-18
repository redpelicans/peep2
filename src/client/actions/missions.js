import { isEmpty } from 'ramda';

export const LOAD_MISSIONS = 'EvtX:Server:missions:load';
export const MISSIONS_LOADED = 'missions:loaded';
export const MISSION_ADDED = 'mission:added';
export const ADD_MISSION = 'EvtX:Server:missions:add';

export const loadMissions = () => (dispatch, getState) => {
  const { people } = getState();
  if (isEmpty(people.data)) {
    dispatch({
      type: LOAD_MISSIONS,
      replyTo: MISSIONS_LOADED,
    });
  }
};

export const addMission = mission => dispatch => {
  dispatch({
    type: ADD_MISSION,
    payload: mission,
    replyTo: MISSION_ADDED,
  });
};
