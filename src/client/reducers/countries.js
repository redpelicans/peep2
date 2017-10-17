import { compose, sortBy, toLower, uniq, concat } from 'ramda';

import { COMPANY_ADDED } from '../actions/companies';

const addCountry = (country, countries) =>
  compose(sortBy(toLower), uniq, concat(countries))([country]);

const countries = (state = { data: [] }, action) => {
  const { type, payload } = action;

  switch (type) {
    case COMPANY_ADDED: {
      const { country } = payload.address;
      return country
        ? { ...state, data: addCountry(country, state.data) }
        : state;
    }
    default:
      return state;
  }
};

export default countries;
