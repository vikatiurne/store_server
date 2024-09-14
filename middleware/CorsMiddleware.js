module.exports = function allowCrossDomain(req, res, next) {
  res.header(`Access-Control-Allow-Origin`, `${process.env.CLIENT_URL}`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Origin, Content-Type`);
  next();
};
