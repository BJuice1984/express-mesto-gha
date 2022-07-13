const { checkToken } = require('../helpers/jwt');
const UnauthorizationError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  console.log('In auth');
  const auth = req.cookies.jwt;

  console.log('auth', auth);

  const token = auth.replace('Bearer ', '');

  if (!token) {
    throw new UnauthorizationError('Ошибка. Необходима авторизация');
  }
  let payload;
  try {
    payload = checkToken(token);
  } catch (err) {
    res.clearCookie('token');
    throw new UnauthorizationError('Ошибка. Необходима авторизация');
  }
  req.user = payload;
  console.log('auth', req.user);

  next();
};
