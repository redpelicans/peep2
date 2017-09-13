import debug from 'debug';
import request from 'request';
import moment from 'moment';
import njwt from 'njwt';
import { Person } from '../models';

const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'auth';
const TOKENINFO = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

const loadUser = ({ email }) => Person.loadByEmail(email).then((user) => {
  if (!user) throw new Error(`Unknown email: ${email}`);
  if (!user.hasSomeRoles(['admin', 'access'])) throw new Error(`Unauthorized email: ${email}`);
  return user;
});

const getToken = (user, secretKey, expirationDate) => {
  const claims = {
    sub: user._id.toString(),
    iss: 'http://timetrack.repelicans.com',
  };
  const jwt = njwt.create(claims, secretKey);
  jwt.setExpiration(expirationDate);
  return jwt.compact();
};

const checkGoogleUser = (token, { clientId }) => {
  const promise = new Promise((resolve, reject) => {
    request({
      method: 'GET',
      uri: `${TOKENINFO}?id_token=${token}`,
      json: true,
      timeout: 5000,
    }, (error, response, body) => {
      if (error || response.statusCode !== 200) return reject(new Error(error));
      if (body.aud !== clientId) return reject(new Error('Wrong Google token_id!'));
      return resolve(body);
    });
  });
  return promise;
};

export const auth = {
  checkToken() {
    const { user, socket, message: { token } } = this;
    if (!token) return Promise.resolve({});
    if (user) {
      this.emit('auth:login', { user, socket });
      return Promise.resolve({ token, user });
    }
    return Promise.reject(new Error('Wrong token'));
  },

  login({ idToken }) {
    if (!idToken) throw new Error('Cannot login without a token');
    const { secretKey, sessionDuration, google: googleConfig } = this.evtx.config;
    return checkGoogleUser(idToken, googleConfig)
      .then(loadUser)
      .then((user) => {
        const expires = moment().add(sessionDuration || 8, 'hours').toDate();
        const token = getToken(user, secretKey, expires);
        const { socket } = this;
        this.emit('auth:login', { user, socket });
        return { user, token };
      });
  },

  logout() {
    const { user, socket } = this;
    this.emit('auth:logout', { user, socket });
    return Promise.resolve();
  }
};

const init = (evtx) => {
  evtx.use(SERVICE_NAME, auth);
  loginfo('auth service registered');
};

export default init;
