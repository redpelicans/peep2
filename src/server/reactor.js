import debug from 'debug';
import R from 'ramda';
import Person from './models/people';

const loginfo = debug('peep:reactor');

const getUser = ctx => {
  const { locals: { user } = {}, message: { token } } = ctx;
  if (user) return Promise.resolve(ctx);
  if (!token) return Promise.resolve(ctx);
  const { secretKey } = ctx.evtx.globals;
  return Person.getFromToken(token, secretKey).then(person => ({
    ...ctx,
    // user: person,
    locals: { ...ctx.locals, user: person },
  }));
};

const formatServiceMethod = ctx => {
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

const makeOutput = (payload, type) => ({ payload, type });

const formatResponse = ctx => {
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
    this.evtx.before(getUser, formatServiceMethod).after(formatResponse);
  }

  initEvents() {
    this.initAuth();
    this.initCompanies();
    this.initPeople();
    this.initNotes();
    this.initMissions();
    this.initWorkersEvents();
  }

  whoswho() {
    return R.map(u => u.email, this.getConnectedUsers());
  }

  getSockets(targetUser) {
    return R.compose(
      R.pluck('socket'),
      R.filter(({ user }) => targetUser.equals(user)),
      R.values,
    )(this.conx);
  }

  getConnectedUsers() {
    return R.compose(
      R.values,
      R.reduce((acc, { user }) => {
        acc[user._id] = user;
        return acc;
      }, {}),
      R.values,
    )(this.conx);
  }

  broadcast(pushEvent) {
    return ctx => {
      const { message: { replyTo } } = ctx;
      if (!replyTo) return;
      this.getConnectedUsers().forEach(targetUser => {
        this.getSockets(targetUser).forEach(targetSocket => {
          pushEvent(ctx, targetUser, targetSocket);
        });
      });
    };
  }

  initWorkersEvents() {
    const { evtx } = this;
    const pushEvent = (
      { locals: { socket }, output, message: { replyTo } },
      targetUser,
      targetSocket,
    ) => {
      const action = makeOutput(output, replyTo);
      if (targetSocket === socket) return;
      targetSocket.emit('action', action);
    };
    evtx.service('events').on('events:added', this.broadcast(pushEvent));
    evtx.service('events').on('events:updated', this.broadcast(pushEvent));
    evtx.service('events').on('events:deleted', this.broadcast(pushEvent));
  }

  initCompanies() {
    const { evtx } = this;
    const pushPreferredEvent = (
      { locals: { socket, user }, output: company, message: { replyTo } },
      targetUser,
      targetSocket,
    ) => {
      const action = makeOutput(company, replyTo);
      if (targetSocket === socket) return;
      if (user.equals(targetUser)) return targetSocket.emit('action', action);
    };
    const pushEvent = (
      { locals: { socket, user }, output: company, message: { replyTo } },
      targetUser,
      targetSocket,
    ) => {
      const action = makeOutput(company, replyTo);
      if (targetSocket === socket) return;
      if (user.equals(targetUser)) return targetSocket.emit('action', action);
      evtx
        .service('companies')
        .loadOne(company._id, { user: targetUser })
        .then(userCompany => {
          const pushedCompany = { ...userCompany, authorId: user._id };
          const action = makeOutput(pushedCompany, replyTo); // eslint-disable-line no-shadow
          targetSocket.emit('action', action);
        });
    };
    evtx.service('companies').on('company:added', this.broadcast(pushEvent));
    evtx.service('companies').on('company:updated', this.broadcast(pushEvent));
    evtx.service('companies').on('company:deleted', this.broadcast(pushEvent));
    evtx
      .service('companies')
      .on('company:setPreferred', this.broadcast(pushPreferredEvent));
  }

  initPeople() {
    const { evtx } = this;
    const pushEvent = (
      { locals: { socket, user }, output: person, message: { replyTo } },
      targetUser,
      targetSocket,
    ) => {
      const action = makeOutput(person, replyTo);
      if (targetSocket === socket) return;
      if (user.equals(targetUser)) return targetSocket.emit('action', action);
      evtx
        .service('people')
        .loadOne(person._id, { user: targetUser })
        .then(userPerson => {
          const pushedPerson = { ...userPerson, authorId: user._id };
          const action = makeOutput(pushedPerson, replyTo); // eslint-disable-line no-shadow
          targetSocket.emit('action', action);
        });
    };
    evtx.service('people').on('person:added', this.broadcast(pushEvent));
    evtx.service('people').on('person:updated', this.broadcast(pushEvent));
    evtx.service('people').on('person:deleted', this.broadcast(pushEvent));
  }

  initMissions() {
    const { evtx } = this;
    const pushEvent = (
      {
        locals: { socket },
        output: mission,
        message: { broadcastAll, replyTo },
      },
      targetUser,
      targetSocket,
    ) => {
      const action = makeOutput(mission, replyTo);
      if (!broadcastAll && targetSocket === socket) return;
      targetSocket.emit('action', action);
    };
    evtx.service('missions').on('mission:added', this.broadcast(pushEvent));
    evtx.service('missions').on('mission:updated', this.broadcast(pushEvent));
    evtx.service('missions').on('mission:deleted', this.broadcast(pushEvent));
  }

  initNotes() {
    const { evtx } = this;
    const pushEvent = (
      { locals: { socket }, output: note, message: { broadcastAll, replyTo } },
      targetUser,
      targetSocket,
    ) => {
      const action = makeOutput(note, replyTo);
      if (!broadcastAll && targetSocket === socket) return;
      targetSocket.emit('action', action);
    };
    evtx.service('notes').on('note:added', this.broadcast(pushEvent));
    evtx.service('notes').on('note:updated', this.broadcast(pushEvent));
    evtx.service('notes').on('note:deleted', this.broadcast(pushEvent));
    evtx.service('notes').on('notes:deleted', this.broadcast(pushEvent));
  }

  initAuth() {
    const { evtx } = this;
    evtx.service('auth').on('auth:login', ({ user, socket }) => {
      this.conx[socket.id] = { user, socket, date: new Date() };
      loginfo(`user '${user.email}' logged in.`);
    });
    evtx.service('auth').on('auth:logout', ({ socket, user }) => {
      if (user) loginfo(`user '${user.email}' logged out.`);
      delete this.conx[socket.id];
    });
  }

  initIO() {
    const { evtx, io } = this;
    io.on('connection', socket => {
      socket.on('action', (message, cb) => {
        loginfo(`receive ${message.type} action`);
        const localCtx = { io, socket };
        evtx
          .run(message, localCtx)
          .then(res => {
            if (!res) return;
            if (cb) {
              loginfo(`answered ${message.type} action callback`);
              return cb(null, res);
            }
            socket.emit('action', res);
            if (res.type) loginfo(`sent ${res.type} action`);
            else loginfo(`answered ${message.type} action`);
          })
          .catch(err => {
            const res = R.is(Error, err)
              ? { code: 500, message: err.toString() }
              : { code: err.code, message: err.error };
            if (process.env.NODE_ENV !== 'test')
              console.error(err.stack || res.message); // eslint-disable-line no-console
            if (cb) return cb(res);
            socket.emit('action', { type: 'EvtX:Error', ...res });
          });
      });
    });
  }
}

const init = ctx => {
  const { evtx, io } = ctx;
  new Reactor(evtx, io);
  return Promise.resolve(ctx);
};

export default init;
