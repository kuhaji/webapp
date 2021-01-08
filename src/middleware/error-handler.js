module.exports = (err, req, res, next) => {
  const {statusCode = 500 , message} = err;
  if (!err.statusCode) {
    console.error(err);
  }
  res.status(statusCode)
  res.json({
    status: 'error',
    code: statusCode,
    message
  });
};
