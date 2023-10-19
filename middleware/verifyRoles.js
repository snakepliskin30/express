const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const roles = [...allowedRoles];
    console.log('req.roles', req.roles);
    console.log('allowedRoles', roles);
    const isRoleAllowed = req.roles.map((role) => roles.includes(role)).find((isIncluded) => isIncluded === true);
    if (!isRoleAllowed) return res.sendStatus(401);
    next();
  };
};

export default verifyRoles;
