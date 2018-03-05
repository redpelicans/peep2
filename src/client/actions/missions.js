import { isEmpty } from 'ramda';
import { getPeople } from '../selectors/people';

export const LOAD_MISSIONS = 'EvtX:Server:missions:load';
export const MISSIONS_LOADED = 'missions:loaded';
export const ADD_MISSION = 'EvtX:Server:missions:add';
export const MISSION_ADDED = 'mission:added';
export const DELETE_MISSION = 'EvtX:Server:missions:del';
export const MISSION_DELETED = 'mission:deleted';
export const UPDATE_MISSION = 'EvtX:Server:missions:update';
export const MISSION_UPDATED = 'mission:updated';
export const FILTER_MISSIONS = 'missions:filter';
export const SORT_MISSIONS = 'sort:missions:list';
export const SPOTLIGHT_MISSIONS = 'spotlight:missions:list';

export const TYPES = {
  WORKER: 'worker',
};

export const loadMissions = () => (dispatch, getState) => {
  const people = getPeople(getState());
  if (isEmpty(people)) {
    dispatch({
      type: LOAD_MISSIONS,
      replyTo: MISSIONS_LOADED,
    });
  }
};

export const addMission = mission => ({
  type: ADD_MISSION,
  payload: mission,
  replyTo: MISSION_ADDED,
});

export const updateMission = mission => ({
  type: UPDATE_MISSION,
  payload: mission,
  replyTo: MISSION_UPDATED,
});

export const deleteMission = id => ({
  type: DELETE_MISSION,
  payload: { _id: id },
  replyTo: MISSION_DELETED,
});

export const filterMissions = type => ({
  type: FILTER_MISSIONS,
  payload: type,
});

export const sortMissions = sortBy => ({
  type: SORT_MISSIONS,
  sortBy,
});

export const spotlightMissions = spotlight => ({
  type: SPOTLIGHT_MISSIONS,
  spotlight,
});

export default { loadMissions };
