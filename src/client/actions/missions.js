import { isEmpty } from 'ramda';

export const LOAD_MISSIONS = 'EvtX:Server:missions:load';
export const MISSIONS_LOADED = 'missions:loaded';
export const ADD_MISSION = 'EvtX:Server:mission:add';
export const MISSION_ADDED = 'mission:added';
export const DELETE_MISSION = 'EvtX:Server:mission:del';
export const MISSION_DELETED = 'mission:deleted';
export const UPDATE_MISSION = 'EvtX:Server:mission:update';
export const MISSION_UPDATED = 'mission:updated';
export const SET_PREFERRED_MISSION = 'EvtX:Server:mission:setPreferred';
export const CHECK_EMAIL = 'EvtX:Server:mission:checkEmailUniqueness';
export const TOGGLE_PREFERRED_FILTER = 'toggle:preferred:people';
export const FILTER_MISSIONS_LIST = 'filter:mission:list';
export const SORT_MISSIONS_LIST = 'sort:people:list';

export const TYPES = {
  WORKER: 'worker',
};

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

export const updateMission = mission => dispatch => {
  dispatch({
    type: UPDATE_MISSION,
    payload: mission,
    replyTo: MISSION_UPDATED,
  });
};

export const deleteMission = id => dispatch => {
  dispatch({
    type: DELETE_MISSION,
    payload: { _id: id },
    replyTo: MISSION_DELETED,
  });
};

export const sortMissionsList = sortBy => ({
  type: SORT_MISSIONS_LIST,
  sortBy,
});

export const filterMissionsList = filter => ({
  type: FILTER_MISSIONS_LIST,
  filter,
});

export default { loadMissions };
