import socketIO from 'socket.io';
import debug from 'debug';

const loginfo = debug('peep:socketIO');
const init = (ctx) => {
  const { http } = ctx;
  const io = socketIO(http);
  loginfo(`socketIO listen on ${http.url}`);
  return Promise.resolve({ ...ctx, io });
};

export default init;
