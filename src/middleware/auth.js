const jwt = require('jsonwebtoken');
const {handleAsync} = require('../helpers');
const User = require('../models/user');
const {UnauthorizedError} = require('../errors');
const {ACCESS_TOKEN_COOKIE_NAME} = require('../constants');

/**
 * Set logged-in user.
 */
module.exports.authenticate = handleAsync(async (req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!accessToken) {
    return next();
  }
  try {
    const payload = jwt.verify(accessToken, process.env.APP_SECRET);
    if (payload.userId && payload.exp < new Date().getTime()) {
      // User is logged in
      const user = await User.findOne({where: {id: payload.userId}});
      if (user) {
        res.locals.user = user;
      }
    }
  } catch (e) {
    // Invalid token
  }
  next();
});

/**
 * Restrict access to logged-in users.
 */
module.exports.allowIfLoggedIn = (req, res, next) => {
  if (res.locals.user !== undefined) {
    // res.locals.user is the logged in user
    return next();
  }
  throw new UnauthorizedError();
}
