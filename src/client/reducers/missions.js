import { compose, fromPairs, map } from 'ramda';
import { MISSIONS_LOADED } from '../actions/missions';

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
    case MISSIONS_LOADED:
      return { ...state, data: makeAll(action.payload) };
    default:
      return state;
  }
};

export default missions;
