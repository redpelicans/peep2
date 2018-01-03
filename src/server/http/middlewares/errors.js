import httpStatus from 'http-status';

const error = (err, req, res, next) => {
  if (!err) return next();
  console.log(err.stack); // eslint-disable-line no-console
  res.sendStatus(err.code || httpStatus.INTERNAL_SERVER_ERROR);
};

export default error;
