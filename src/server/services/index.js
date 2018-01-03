import R from 'ramda';
import initPeople from './people';
import initCompanies from './companies';
import initTags from './tags';
import initCities from './cities';
import initCalendar from './calendar';
import initCountries from './countries';
import initSkills from './skills';
import initEvents from './events';
import initNotes from './notes';
import initAuth from './auth';
import initStatus from './status';
import initMissions from './missions';
import initAddenda from './addenda';

const allServices = [
  initAuth,
  initNotes,
  initSkills,
  initCountries,
  initCities,
  initTags,
  initEvents,
  initCompanies,
  initPeople,
  initCalendar,
  initStatus,
  initMissions,
  initAddenda,
];

const init = evtx =>
  R.reduce((acc, service) => acc.configure(service), evtx, allServices);
export default init;
