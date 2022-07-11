const jwt = require('jsonwebtoken');
const UnauthorizationError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const token = res.cookie.jwt;

  if (!token) {
    throw new UnauthorizationError('Ошибка. Необходима авторизация');
  }
  let payload = jwt.verify(token, 'secret__token');
  try {
    payload = jwt.verify(token, 'secret__token');
  } catch (err) {
    throw new UnauthorizationError('Ошибка. Необходима авторизация');
  }
  req.user = payload;

  next();
};
