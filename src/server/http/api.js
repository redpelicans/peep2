import R from 'ramda';

export const parseUrl = url => {
  const re = new RegExp(/^\/+(\w+)\/*(\w*)\/*(\w*)/);
  const [_, service, id, method] = re.exec(url) || [];
  return R.map(x => x || undefined, [service, id, method]);
};

const getInput = (id, req) => R.mergeAll([req.query, req.body, id && { id }]);

export const getService = req => {
  const [service, method, id] = parseUrl(req.path);
  const input = getInput(id, req);
  return { service, method, input };
};

const server = evtx => (req, res, next) => {
  evtx
    .run(getService(req), { req })
    .then(data => res.json(data))
    .catch(next);
};

export default server;
