import {
  map,
  sortBy,
  compose,
  ifElse,
  is,
  toLower,
  identity,
  prop,
  reverse,
  match,
  filter,
  split,
  values,
  mapObjIndexed,
  allPass
} from "ramda";
import moment from "moment";
import { createSelector } from "reselect";

/* sorting */
const sortByProp = cprop =>
  sortBy(compose(ifElse(is(String), toLower, identity), prop(cprop)));
const sortByOrder = order => (order === "desc" ? reverse : identity);
const doSort = ({ by, order }) =>
  by && by.length ? compose(sortByOrder(order), sortByProp(by)) : identity;

/* filtering */
const regexp = filter => new RegExp(filter, "i");
const getTagsPredicate = cfilter => ({ tags = [] }) =>
  match(regexp(cfilter.slice(1)), tags.join(" ")).length;
const getNamePredicate = cfilter => ({ name }) =>
  match(regexp(cfilter), name).length;
const getPredicate = cfilter =>
  cfilter[0] === "#" ? getTagsPredicate(cfilter) : getNamePredicate(cfilter);
const getPredicates = cfilter =>
  compose(map(getPredicate), split(" "))(cfilter);
const getPreferredPredicate = cfilter => ({ preferred }) =>
  !cfilter || !!preferred === !!cfilter;
const doFilter = (cfilter, preferredFilter) =>
  filter(
    allPass([getPreferredPredicate(preferredFilter), ...getPredicates(cfilter)])
  );

const filterAndSort = (cfilter, sort, preferredFilter, companies) =>
  compose(doSort(sort), doFilter(cfilter, preferredFilter), values)(companies);

/* status */
const isNew = company =>
  !company.updatedAt &&
  moment.duration(moment() - company.createdAt).asHours() < 2;
const isUpdated = company =>
  company.updatedAt &&
  moment.duration(moment() - company.updatedAt).asHours() < 1;
const putStatus = companies =>
  mapObjIndexed(company => ({
    ...company,
    isNew: isNew(company),
    isUpdated: isUpdated(company)
  }))(companies);

/* input selectors */
const getFilter = state => state.companies.filter;
const getSort = state => state.companies.sort;
const getPreferredFilter = state => state.companies.preferredFilter;
export const getCompanies = state => state.companies.data;

/* selectors */
const updateCompaniesStatus = createSelector(getCompanies, putStatus);

export const getVisibleCompanies = createSelector(
  [getFilter, getSort, getPreferredFilter, updateCompaniesStatus],
  (filter, sort, preferredFilter, companies) =>
    filterAndSort(filter, sort, preferredFilter, companies)
);
