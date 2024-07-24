const Permissions = require('../models/RBAC/Permission');
const permissions = new Permissions();

const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming `req.user` contains the authenticated user's info
    const userPermissions = permissions.getPermissionsByRoleName(userRole);

    // Check if user has all required permissions
    const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));

    if (!hasPermission) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }

    next();
  };
};

module.exports = authorize;
