import R from 'ramda';

import { COMPANY_ADDED } from '../actions/companies';

const addCountry = (country, countries) =>
  R.compose(R.sortBy(R.toLower), R.uniq, R.concat(countries))([country]);

const countries = (state = { data: [] }, action) => {
  const { type, payload } = action;

  switch (type) {
    case COMPANY_ADDED: {
      const { country } = payload.address;
      return (country) ? { ...state, data: addCountry(country, state.data) } : state;
    }
    default:
      return state;
  }
};

export default countries;
