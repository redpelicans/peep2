export const SETLOCALE = 'SETLOCALE';
export const setLocale = locale => dispatch => {
  dispatch({ type: SETLOCALE, locale });
};

export const loadLocale = () => (dispatch, getState) => {
  const { intl: { defaultLang, currentLang, availableLangs } } = getState();
  const language = availableLangs.find(lang => lang === currentLang) || defaultLang;
  dispatch({ type: SETLOCALE, locale: language });
};
