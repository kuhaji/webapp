/**
 * Pass unhandled promises from async route handlers to the error handler.
 * 
 * @param {Function} fn - async function
 * @returns {Function} wrapped function
 */
module.exports = fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next);
    