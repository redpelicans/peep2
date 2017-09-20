import R from "ramda";
import initPeople from "./people";
import initCompanies from "./companies";
import initTags from "./tags";
import initCities from "./cities";
import initCalendar from "./calendar";
import initCountries from "./countries";
import initSkills from "./skills";
import initEvents from "./events";
import initNotes from "./notes";
import initStatus from "./status";
import initAuth from "./auth";

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
  initStatus,
  initCalendar
];

const init = evtx =>
  R.reduce((acc, service) => acc.configure(service), evtx, allServices);
export default init;
