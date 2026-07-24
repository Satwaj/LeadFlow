import ApiError from "../utils/ApiError.js";

export const authorizeRoles =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  };
