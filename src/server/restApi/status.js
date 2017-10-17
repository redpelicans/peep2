import debug from 'debug';
import { spawn } from 'child_process';

const startedAt = new Date();
const loginfo = debug('peep:evtx');
const SERVICE_NAME = 'status';
const status = {
  ping() {
    return Promise.resolve({ ping: 'pong' });
  },

  version() {
    const promise = new Promise((resolve, reject) => {
      const cmd = spawn('git', ['log', '-1', '--format="%h"']);
      let version, error;
      cmd.stdout.on(
        'data',
        data => (version = data.toString().replace(/(\n$|\")/g, '')),
      );
      cmd.stderr.on('data', data => (error = data.toString()));
      cmd.on('close', code => {
        if (code != 0) return reject(new Error(error));
        resolve({ version, startedAt });
      });
    });
    return promise;
  },
};

const init = evtx => {
  evtx.use(SERVICE_NAME, status);
  evtx.service(SERVICE_NAME);
  loginfo('status service registered');
};

export default init;
