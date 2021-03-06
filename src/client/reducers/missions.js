import { compose, fromPairs, map, omit } from 'ramda';
import {
  MISSIONS_LOADED,
  SPOTLIGHT_MISSIONS,
  ADD_MISSION,
  MISSION_ADDED,
  MISSION_UPDATED,
  MISSION_DELETED,
  FILTER_MISSIONS,
  SORT_MISSIONS,
} from '../actions/missions';

const make = mission => {
  const updatedMission = {
    ...mission,
    typeName: 'mission',
  };
  if (mission.updatedAt) updatedMission.updatedAt = mission.updatedAt;
  if (mission.createdAt) updatedMission.createdAt = mission.createdAt;
  if (mission.startDate) updatedMission.startDate = mission.startDate;
  if (mission.endDate) updatedMission.endDate = mission.endDate;
  return updatedMission;
};

const makeAll = compose(fromPairs, map(c => [c._id, make(c)]));

const initialState = {
  data: {},
  filter: 'current',
  sort: { by: 'endDate', order: 'desc' },
  spotlight: '',
};

const missions = (state = initialState, action) => {
  switch (action.type) {
    case FILTER_MISSIONS:
      return { ...state, filter: action.payload };
    case SORT_MISSIONS: {
      const { by, order } = state.sort;
      const newOrder = by === action.sortBy && order === 'asc' ? 'desc' : 'asc';
      return { ...state, sort: { by: action.sortBy, order: newOrder } };
    }
    case SPOTLIGHT_MISSIONS:
      return { ...state, spotlight: action.spotlight };
    case MISSIONS_LOADED:
      return { ...state, data: makeAll(action.payload) };
    case ADD_MISSION:
      return { ...state, pending_action: true };
    case MISSION_ADDED:
      return {
        ...state,
        pending_action: false,
        data: {
          ...state.data,
          [action.payload._id]: make(action.payload),
        },
      };
    case MISSION_UPDATED:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload._id]: make(action.payload),
        },
      };
    case MISSION_DELETED:
      return { ...state, data: omit([action.payload._id])(state.data) };
    default:
      return state;
  }
};

export default missions;
