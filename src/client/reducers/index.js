import { combineReducers } from 'redux';
import tags from './tags';
import companies from './companies';
import people from './people';
import message from './message';
import notes from './notes'
import cities from './cities';
import countries from './countries';
import login from './login';

export default combineReducers({
  tags,
  companies,
  people,
  message,
  notes,
  countries,
  cities,
  login,
});
