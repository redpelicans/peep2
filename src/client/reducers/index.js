import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import tags from "./tags";
import companies from "./companies";
import people from "./people";
import message from "./message";
import notes from "./notes";
import cities from "./cities";
import countries from "./countries";
import calendar from "./calendar";
import login from "./login";
import intl from "./intl";

export default combineReducers({
  form: formReducer,
  tags,
  companies,
  people,
  message,
  notes,
  countries,
  cities,
  login,
  calendar,
  intl
});
