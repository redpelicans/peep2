import React from 'react';
import { path } from 'ramda';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import socketIO from 'socket.io-client';
import { addLocaleData } from 'react-intl';
import fr from 'react-intl/locale-data/fr';
import en from 'react-intl/locale-data/en';
import configureStore from './store/configureStore';
import history from './history';
import App from './components/App';
import Kontrolo from './lib/kontrolo';
import { loadLocale } from './actions/intl';
import ConnectedIntlProvider from './components/ConnectedIntlProvider';

import { checkToken, userLogged } from './actions/login';
import messages from './messages.json';

addLocaleData([...fr, ...en]);

const { navigator: { language } } = global;

const token = localStorage.getItem('peepToken');
const initialState = {
  intl: {
    defaultLang: 'en',
    currentLang: language,
    availableLangs: ['en', 'fr'],
    messages,
  },
  login: { token },
};

const io = socketIO.connect();
io.on('disconnect', () => console.log('socket.io disconnected ...')); // eslint-disable-line no-console
io.on('error', err => console.log(`socket.io error: ${err}`)); // eslint-disable-line no-console

const store = configureStore(initialState, io);
const mountNode = window.document.getElementById('__PEEP__');

store.dispatch(loadLocale());

const root = (
  <Provider store={store}>
    <ConnectedIntlProvider>
      <Router history={history}>
        <Kontrolo user={path(['login', 'user'])} isAuthorized={user => Boolean(user)} redirect="/login">
          <App />
        </Kontrolo>
      </Router>
    </ConnectedIntlProvider>
  </Provider>
);

console.log('mounting React, peep peep don\'t sleep ...'); // eslint-disable-line no-console
io.on('connect', () => {
  console.log('socket.io connected.'); // eslint-disable-line no-console
  if (token) {
    store.dispatch(checkToken((err, { user, token } = {}) => { // eslint-disable-line no-shadow
      if (err) console.error(err.message); // eslint-disable-line no-console
      else {
        store.dispatch(userLogged(user, token));
      }
      render(root, mountNode);
    }));
  } else {
    render(root, mountNode);
  }
});
