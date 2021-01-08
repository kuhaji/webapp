const ac = require('../roles');
const {ForbiddenError} = require('../errors');

module.exports = (action, resource) => (req, res, next) => {
  const userRole = res.locals.user.role;
  let [operation, possession] = action.split(':');
  if (possession === 'own') {
    const grants = ac.getGrants();
    const anyPermission = grants[userRole][resource][`${operation}:any`];
    if (anyPermission) {
      possession = 'any';
    } else {
      const isOwner = req.params.userId === String(res.locals.user.id);
      if (!isOwner) {
        throw new ForbiddenError();
      }
    }
  }
  const permission = ac.permission({
    action: [operation, possession].join(':'),
    role: userRole,
    resource
  });
  if (permission.granted) {
    return next();
  }
  throw new ForbiddenError();
}
