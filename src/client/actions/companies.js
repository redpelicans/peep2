import R from 'ramda';

export const LOAD_COMPANIES = 'EvtX:Server:companies:load';
export const COMPANIES_LOADED = 'companies:loaded';
export const ADD_COMPANY = 'EvtX:Server:companies:add';
export const UPDATE_COMPANY = 'EvtX:Server:companies:update';
export const COMPANY_ADDED = 'company:added';
export const COMPANY_UPDATED = 'company:updated';
export const FILTER_COMPANY_LIST = 'filter:company:list';
export const TOGGLE_PREFERRED_FILTER = 'toggle:preferred:companies';
export const SET_PREFERRED_COMPANY = 'EvtX:Server:companies:setPreferred';
export const SORT_COMPANY_LIST = 'sort:company:list';

export const loadCompanies = () => (dispatch, getState) => {
  const { companies } = getState();
  if (R.isEmpty(companies.data)) {
    dispatch({
      type: LOAD_COMPANIES,
      replyTo: COMPANIES_LOADED,
    });
  }
};

export const addCompany = company => (dispatch) => {
  dispatch({
    type: ADD_COMPANY,
    payload: company,
    replyTo: COMPANY_ADDED,
  });
};

export const updateCompany = company => (dispatch) => {
  dispatch({
    type: UPDATE_COMPANY,
    payload: company,
    replyTo: COMPANY_UPDATED,
  });
};

export const togglePreferred = company => (dispatch) => {
  const { _id, preferred } = company;
  dispatch({
    type: SET_PREFERRED_COMPANY,
    replyTo: COMPANY_UPDATED,
    payload: { _id, preferred: !preferred },
  });
};

export const togglePreferredFilter = () => ({ type: TOGGLE_PREFERRED_FILTER });

export const filterCompanyList = filter => ({
  type: FILTER_COMPANY_LIST,
  filter,
});

export const sortCompanyList = sortBy => ({
  type: SORT_COMPANY_LIST,
  sortBy,
});

export default { loadCompanies, addCompany, updateCompany };
