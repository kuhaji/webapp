const AccessControl = require('accesscontrol');
const ac = new AccessControl();

ac.grant('basic')
  .readOwn('user')
  .updateOwn('user')
  .readAny('imagepost')
  .createOwn('imagepost')
  .updateOwn('imagepost')
  .deleteOwn('imagepost');

ac.grant('admin')
  .extend('basic')
  .createAny('user')
  .updateAny('user')
  .readAny('user')
  .deleteAny('user')
  .deleteAny('imagepost');

module.exports = ac;
