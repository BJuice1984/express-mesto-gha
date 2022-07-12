const { checkToken } = require('../helpers/jwt');
const UnauthorizationError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  console.log('In auth');
  const auth = res.cookie.jwt;

  console.log('auth', auth);

  const token = auth.replace('Bearer ', '');

  if (!token) {
    throw new UnauthorizationError('Ошибка. Необходима авторизация');
  }
  let payload = checkToken(token);
  try {
    payload = checkToken(token);
  } catch (err) {
    throw new UnauthorizationError('Ошибка. Необходима авторизация');
  }
  req.user = payload;

  next();
};
