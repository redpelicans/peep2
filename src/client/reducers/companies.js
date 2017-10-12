import { compose, fromPairs, map, omit } from 'ramda';
import {
  FILTER_COMPANY_LIST,
  SORT_COMPANY_LIST,
  ADD_COMPANY,
  COMPANY_ADDED,
  COMPANY_UPDATED,
  COMPANIES_LOADED,
  TOGGLE_PREFERRED_FILTER,
  COMPANY_DELETED,
} from '../actions/companies';

const make = company => {
  const updatedCompany = {
    ...company,
    typeName: 'company',
    createdAt: company.createdAt ? company.createdAt : undefined,
  };
  if (company.updatedAt) updatedCompany.updatedAt = company.updatedAt;
  return updatedCompany;
};
const makeAll = compose(fromPairs, map(c => [c._id, make(c)]));

const initialState = {
  data: {},
  sort: { by: 'name', order: 'asc' },
  filter: '',
};

const companies = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PREFERRED_FILTER:
      return { ...state, preferredFilter: !state.preferredFilter };
    case FILTER_COMPANY_LIST:
      return { ...state, filter: action.filter };
    case SORT_COMPANY_LIST: {
      const { by, order } = state.sort;
      const newOrder = by === action.sortBy && order === 'asc' ? 'desc' : 'asc';
      return { ...state, sort: { by: action.sortBy, order: newOrder } };
    }
    case COMPANIES_LOADED:
      return { ...state, data: makeAll(action.payload) };
    case ADD_COMPANY:
      return { ...state, pending_action: true };
    case COMPANY_ADDED:
      return {
        ...state,
        pending_action: false,
        data: {
          ...state.data,
          [action.payload._id]: make(action.payload),
        },
      };
    case COMPANY_UPDATED:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload._id]: make(action.payload),
        },
      };
    case COMPANY_DELETED:
      return { ...state, data: omit([action.payload._id])(state.data) };
    default:
      return state;
  }
};

export default companies;
