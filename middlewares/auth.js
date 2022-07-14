const { checkToken } = require('../helpers/jwt');
const UnauthorizationError = require('../errors/unauth-err');

module.exports = (req, res, next) => {
  const auth = req.cookies.jwt;

  if (!auth) {
    throw new UnauthorizationError('Авторизуйтесь для доступа');
  }

  const token = auth.replace('Bearer ', '');

  let payload;
  try {
    payload = checkToken(token);
  } catch (err) {
    res.clearCookie('jwt');
    throw new UnauthorizationError('Авторизуйтесь для доступа');
  }
  req.user = payload;

  next();
};
