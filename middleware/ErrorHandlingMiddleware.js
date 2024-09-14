const ApiError = require("../error/ApiError");

module.exports = function errorHandler(err, req, res, next) {
  console.log(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  }
  return res.json("Невідома помилка");
};
