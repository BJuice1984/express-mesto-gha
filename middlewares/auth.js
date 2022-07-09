const jwt = require('jsonwebtoken');
const UnauthorizationError = require('../errors/unauth-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = res.cookies.jwt;

  if (!token) {
    return new UnauthorizationError('Ошибка. Необходима авторизация');
  }
  let payload = jwt.verify(token, 'secret__token');
  try {
    payload = jwt.verify(token, 'secret__token');
  } catch (err) {
    return new UnauthorizationError('Ошибка. Необходима авторизация');
  }
  req.user = payload;

  next();
};
