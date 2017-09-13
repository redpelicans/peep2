const error = (err, req, res, next) => {
  if (!err) return next();
  const message = err.message;
  console.log(err.stack); // eslint-disable-line no-console
  res.status(500).json({ message });
};

export default error;
