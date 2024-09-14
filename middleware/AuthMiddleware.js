const ApiError = require('../error/ApiError.js')
const tokenService = require('../service/token-service.js')


module.exports =  function authMiddleware(req, res, next) {
  try {
    const autorizationHeader = req.headers.authorization;
    if (!autorizationHeader) {
      return next(ApiError.unauthorizedError());
    }
    const accessToken = autorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.unauthorizedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.unauthorizedError());
    }
    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.unauthorizedError());
  }
}
