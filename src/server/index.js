import debug from 'debug';
import initHttp from './http';
import initSocketIO from './socketio';
import initEvtx from './evtx';
import initMongo from './mongo';
import config from '../../params';

const loginfo = debug('peep');

initMongo({ config })
  .then(initHttp)
  .then(initSocketIO)
  .then(initEvtx)
  .then(() => loginfo('server started, don\'t sleep !'))
  .catch(console.error); // eslint-disable-line no-console
