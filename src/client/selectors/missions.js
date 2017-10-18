export const getFilter = state => state.missions.filter;
export const getSort = state => state.missions.sort;
export const getMissions = state => state.missions.data;
export const getMission = (state, id) => state.missions.data[id];
