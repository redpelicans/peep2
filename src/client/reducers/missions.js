import { compose, fromPairs, map, omit } from 'ramda';
import {
  MISSIONS_LOADED,
  FILTER_MISSIONS_LIST,
  ADD_MISSION,
  MISSION_ADDED,
  MISSION_UPDATED,
  MISSION_DELETED,
  SORT_MISSIONS_LIST,
} from '../actions/missions';

const make = mission => {
  const updatedMission = {
    ...mission,
    typeName: 'mission',
    createdAt: mission.createdAt ? mission.createdAt : undefined,
  };
  if (mission.updatedAt) updatedMission.updatedAt = mission.updatedAt;
  return updatedMission;
};

const makeAll = compose(fromPairs, map(c => [c._id, make(c)]));

const initialState = {
  data: {},
  sort: { by: 'name', order: 'asc' },
  filter: '',
};

const missions = (state = initialState, action) => {
  switch (action.type) {
    case SORT_MISSIONS_LIST: {
      const { by, order } = state.sort;
      const newOrder = by === action.sortBy && order === 'asc' ? 'desc' : 'asc';
      return { ...state, sort: { by: action.sortBy, order: newOrder } };
    }
    case FILTER_MISSIONS_LIST:
      return { ...state, filter: action.filter };
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
