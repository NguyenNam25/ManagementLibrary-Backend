export const checkStatus = (status) => {
    return (req, res, next) => {
      const status = req.user.status;
      if (!status.includes(status)) {
        return res.status(403).json({ message: "Permission denied" });
      }
      next();
    };
  };