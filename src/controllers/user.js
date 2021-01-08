const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {handleAsync} = require('../helpers');
const {UnauthorizedError, NotFoundError, BadRequestError} = require('../errors');
const {ACCESS_TOKEN_COOKIE_NAME, ACCESS_TOKEN_TTL} = require('../constants');

/**
 * Create a new user.
 */
module.exports.createUser = handleAsync(async (req, res) => {
  const {
    username,
    password,
    role = 'basic'
  } = req.body;
  // Validate fields here and provide validation errors in response.
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      username,
      password: passwordHash,
      role
    });
    res.json({
      status: 'success',
      user: user.toJSON()
    });
  } catch (e) {
    throw new BadRequestError();
  }
});

/**
 * Get user by id.
 */
module.exports.getUser = handleAsync(async (req, res) => {
  const {userId} = req.params;
  const user = await User.findOne({where: {id: userId}});
  if (user) {
    res.json({user: user.toJSON()});
  } else {
    throw new NotFoundError();
  }
});

/**
 *  Get all users.
 */
module.exports.getUsers = handleAsync(async (req, res) => {
  const {page = 0, pageSize = 15} = req.query;
  const limit = parseInt(pageSize);
  const offset = limit * parseInt(page);
  const {count, rows} = await User.findAndCountAll({offset, limit});
  const users = rows.map(user => user.toJSON());
  const pages = Math.ceil(count / limit);
  res.json({users, total: count, pages});
});

/**
 * Login user.
 */
module.exports.login = handleAsync(async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({where: {username}});
  if (!user || !user.password) {
    throw new UnauthorizedError('Invalid username or password');
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid username or password');
  }
  const tokenPayload = {userId: user.id, role: user.role};
  const accessToken = jwt.sign(tokenPayload, process.env.APP_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL
  });
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    path: '/api',
    httpOnly: true,
    expires: new Date(new Date().getTime() + ACCESS_TOKEN_TTL * 1000),
    secure: process.env.NODE_ENV === 'production'
  });

  res.json({
    status: 'success',
    user: user.toJSON()
  });
});
