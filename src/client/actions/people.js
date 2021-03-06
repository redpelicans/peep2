import { isEmpty } from 'ramda';

export const LOAD_PEOPLE = 'EvtX:Server:people:load';
export const PEOPLE_LOADED = 'people:loaded';
export const ADD_PEOPLE = 'EvtX:Server:people:add';
export const PEOPLE_ADDED = 'people:added';
export const DELETE_PEOPLE = 'EvtX:Server:people:del';
export const PEOPLE_DELETED = 'people:deleted';
export const UPDATE_PEOPLE = 'EvtX:Server:people:update';
export const PEOPLE_UPDATED = 'people:updated';
export const SET_PREFERRED_PEOPLE = 'EvtX:Server:people:setPreferred';
export const CHECK_EMAIL = 'EvtX:Server:people:checkEmailUniqueness';
export const TOGGLE_PREFERRED_FILTER = 'toggle:preferred:people';
export const FILTER_PEOPLE_LIST = 'filter:people:list';
export const SORT_PEOPLE_LIST = 'sort:people:list';

export const TYPES = {
  WORKER: 'worker',
};

export const loadPeople = () => (dispatch, getState) => {
  const { people } = getState();
  if (isEmpty(people.data)) {
    dispatch({
      type: LOAD_PEOPLE,
      replyTo: PEOPLE_LOADED,
    });
  }
};

export const addPeople = people => dispatch => {
  dispatch({
    type: ADD_PEOPLE,
    payload: people,
    replyTo: PEOPLE_ADDED,
  });
};

export const updatePeople = people => dispatch => {
  dispatch({
    type: UPDATE_PEOPLE,
    payload: people,
    replyTo: PEOPLE_UPDATED,
  });
};

export const deletePeople = id => dispatch => {
  dispatch({
    type: DELETE_PEOPLE,
    payload: { _id: id },
    replyTo: PEOPLE_DELETED,
  });
};

export const checkEmail = ({ previous, next: email } = {}) => dispatch => {
  if (previous === email) return Promise.resolve(true);
  const promise = new Promise(resolve => {
    const callback = (err, res) => {
      return resolve(!err && res.ok);
    };
    const action = {
      type: CHECK_EMAIL,
      callback,
      payload: email,
    };
    dispatch(action);
  });
  return promise;
};

export const onPreferredClick = person => dispatch => {
  const { _id, preferred } = person;
  dispatch({
    type: SET_PREFERRED_PEOPLE,
    replyTo: PEOPLE_UPDATED,
    payload: { _id, preferred: !preferred },
  });
};

export const togglePreferredFilter = () => ({ type: TOGGLE_PREFERRED_FILTER });

export const sortPeopleList = sortBy => ({
  type: SORT_PEOPLE_LIST,
  sortBy,
});

export const onTagClick = filter => ({
  type: FILTER_PEOPLE_LIST,
  filter,
});

export default { loadPeople };
