import { createSelector } from "reselect";

const getLogin = state => state.login.user;
export const getUser = createSelector([getLogin], user => user);
