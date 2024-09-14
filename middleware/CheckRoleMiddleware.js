const ApiError = require("../error/ApiError.js");
const tokenService = require("../service/token-service.js");

module.exports = function checkRoleMiddleware(role) {
  return function (req, res, next) {
    try {
      const autorizationHeader = req.headers.authorization;
      if (!autorizationHeader) {
        return next(ApiError.unauthorizedError());
      }
      const accessToken = autorizationHeader.split(" ")[1];
      if (!accessToken) {
        return next(ApiError.unauthorizedError());
      }
      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) {
        return next(ApiError.unauthorizedError());
      }
      if (userData.role.toUpperCase() !== role.toUpperCase()) {
        return next(ApiError.forbidden("Доступ має тільки адміністратор"));
      }
      req.user = userData;
      next();
    } catch (error) {
      return next(ApiError.unauthorizedError());
    }
  };
};
