import R from 'ramda';

export const parseUrl = url => {
  const re = new RegExp(/^\/+(\w+)\/*(\w*)/);
  const [_, method, id] = re.exec(url); // eslint-disable-line no-unused-vars
  return R.map(x => x || undefined, [method, id]);
};

const getInput = (id, req) => R.mergeAll([req.query, req.body, id && { id }]);

export const getMessage = (service, req) => {
  const [method, id] = parseUrl(req.path);
  const input = getInput(id, req);
  return { service, method, input };
};

const server = (service, evtx) => (req, res, next) => {
  evtx
    .run(getMessage(service, req), { req })
    .then(data => {
      if (data.pipe) {
        data.on('error', next);
        data.pipe(res);
      } else {
        res.json(data);
      }
    })
    .catch(next);
};

export default server;
