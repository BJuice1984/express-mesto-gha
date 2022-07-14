const { checkToken } = require('../helpers/jwt');
const User = require('../models/user');

const throwUnauthorizedError = () => {
  const error = new Error('Авторизуйтесь для доступа');
  error.statusCode = 401;
  throw error;
};

module.exports = (req, res, next) => {
  const auth = req.cookies.jwt;

  if (!auth) {
    throwUnauthorizedError();
  }

  const token = auth.replace('Bearer ', '');

  let payload;
  try {
    payload = checkToken(token);

    User.findById(payload._id)
      .then((user) => {
        if (!user) {
          throwUnauthorizedError();
        }
      });
  } catch (err) {
    res.clearCookie('jwt');
    throwUnauthorizedError();
  }
  req.user = payload;

  next();
};
