import debug from 'debug';
import R from 'ramda';
import Company from '../models/companies';
import Person from '../models/people';

const loginfo = debug('peep:reactor');
const logerror = debug('peep:Error');

const getUser = (ctx) => {
  const { user, message: { token } } = ctx;
  if (user) return Promise.resolve(ctx);
  if (!token) return Promise.resolve(ctx);
  const { secretKey } = ctx.evtx.config;
  return Person.getFromToken(token, secretKey).then(user => ({ ...ctx, user }));
};

const formatServiceMethod = (ctx) => {
  const { service, method, message: { type, payload } } = ctx;
  if (service && method) return Promise.resolve(ctx);
  const [serv, meth] = type.split(':');
  return Promise.resolve({
    ...ctx,
    input: payload,
    service: serv,
    method: meth,
  });
};

const makeOutput = (payload, type) => {
  return { payload, type };
};

const formatResponse = (ctx) => {
  const { output, message: { replyTo } } = ctx;
  if (replyTo) {
    return Promise.resolve({
      ...ctx,
      output: makeOutput(output, replyTo),
    });
  }
  return Promise.resolve(ctx);
};

class Reactor {
  constructor(evtx, io) {
    this.io = io;
    this.evtx = evtx;
    this.initEvtX();
    this.initIO();
    this.initEvents();
    this.conx = {};
  }

  initEvtX() {
    this.evtx
      .before(getUser, formatServiceMethod)
      .after(formatResponse);
  }

  initEvents() {
    this.initAuth();
    this.initCompanies();
    this.initPeople();
    this.initNotes();
  }

  whoswho() {
    return R.map(u => u.email, this.getConnectedUsers());
  }

  getSockets(targetUser) {
    return R.compose(R.pluck('socket'), R.filter(({ user, socket }) => targetUser.equals(user)), R.values)(this.conx);
  }

  getConnectedUsers() {
    return R.compose(R.values, R.reduce((acc, { user }) => { acc[user._id] = user; return acc; }, {}), R.values)(this.conx);
  }

  broadcast(pushEvent) {
    return (ctx) => {
      const { message: { replyTo } } = ctx;
      if (!replyTo) return;
      for(const targetUser of this.getConnectedUsers()) {
        for(const targetSocket of this.getSockets(targetUser)) {
          pushEvent(ctx, targetUser, targetSocket);
        }
      }
    }
  }

  initCompanies() {
    const { evtx } = this;
    const pushPreferredEvent= ({ socket, user, output: company, message: { replyTo } }, targetUser, targetSocket) => {
      const action = makeOutput(company, replyTo);
      if (targetSocket === socket) return;
      if (user.equals(targetUser)) return targetSocket.emit('action', action);
    }
    const pushEvent = ({ socket, user, output: company, message: { replyTo } }, targetUser, targetSocket) => {
      const action = makeOutput(company, replyTo);
      if (targetSocket === socket) return;
      if (user.equals(targetUser)) return targetSocket.emit('action', action);
      evtx.service('companies')
        .loadOne(company._id, { user: targetUser })
        .then((userCompany) => {
          const pushedCompany = { ...userCompany, authorId: user._id };
          const action = makeOutput(pushedCompany, replyTo);
          targetSocket.emit('action', action);
        });
    }
    evtx.service('companies').on('company:added', this.broadcast(pushEvent));
    evtx.service('companies').on('company:updated', this.broadcast(pushEvent));
    evtx.service('companies').on('company:setPreferred', this.broadcast(pushPreferredEvent));
  }

  initPeople() {
    const { evtx } = this;
    const pushEvent = ({ socket, user, output: person, message: { replyTo } }, targetUser, targetSocket) => {
      const action = makeOutput(person, replyTo);
      if (targetSocket === socket) return;
      if (user.equals(targetUser)) return targetSocket.emit('action', action);
      evtx.service('people')
        .loadOne(person._id, { user: targetUser })
        .then((userPerson) => {
          const pushedPerson = { ...userPerson, authorId: user._id };
          const action = makeOutput(pushedPerson, replyTo);
          targetSocket.emit('action', action);
        });
    }
    evtx.service('people').on('person:added', this.broadcast(pushEvent));
    evtx.service('people').on('person:updated', this.broadcast(pushEvent));
  }

  initNotes() {
    const { evtx } = this;
    const pushEvent = ({ socket, user, output: note, message: { broadcastAll, replyTo } }, targetUser, targetSocket) => {
      const action = makeOutput(note, replyTo);
      if (!broadcastAll && targetSocket === socket) return;
      targetSocket.emit('action', action);
    }
    evtx.service('notes').on('note:added', this.broadcast(pushEvent));
    evtx.service('notes').on('note:updated', this.broadcast(pushEvent));
  }

  initAuth() {
    const { evtx } = this;
    evtx.service('auth').on('auth:login', ({ user, socket }) => {
      this.conx[socket.id] = { user, socket, date: new Date() };
      loginfo(`user '${user.email}' logged in.`);
    });
    evtx.service('auth').on('auth:logout', ({ socket, user }) => {
      loginfo(`user '${user.email}' logged out.`);
      delete this.conx[socket.id];
    });
  }

  initIO() {
    const { evtx, io } = this;
    io.on('connection', (socket) => {
      socket.on('action', (message, cb) => {
        loginfo(`receive ${message.type} action`);
        const globalCtx = { io, socket };
        evtx.run(message, globalCtx)
          .then((res) => {
            if (!res) return;
            if (cb) {
              loginfo(`answered ${message.type} action`);
              return cb(null, res);
            }
            socket.emit('action', res);
            if (res.type) loginfo(`sent ${res.type} action`);
            else loginfo(`answered ${message.type} action`);
          })
          .catch((err) => {
            const res = R.is(Error, err) ? { code: 500, message: err.toString() } : { code: err.code, message: err.error };
            console.error(err.stack || res.message);
            if (cb) return cb(res);
            socket.emit('action', { type: 'EvtX:Error', ...res });
          });
      });
    });
  }
};

const init = (evtx, io) => {
  return Promise.resolve(new Reactor(evtx, io));
}

export default init;
