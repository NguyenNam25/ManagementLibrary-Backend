const checkRoles = (roles) => {
    return (req, res, next) => {
      const role = req.user.role;
      console.log("role", role);
      if (!roles.includes(role)) {
        return res.status(403).json({ message: "Permission denied" });
      }
      next();
    };
  };

module.exports = { checkRoles };
