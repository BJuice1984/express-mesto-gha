const { checkToken } = require('../helpers/jwt');
const User = require('../models/user');

const throwUnauthorizedError = () => {
  const error = new Error('Авторизуйтесь для доступа');
  error.statusCode = 401;
  throw error;
};

module.exports = (req, res, next) => {
  const auth = req.cookies.jwt;

  console.log('auth', auth);

  if (!auth) {
    throwUnauthorizedError();
  }

  const token = auth.replace('Bearer ', '');

  let payload;
  try {
    payload = checkToken(token);
    console.log('payload', payload);

    User.findById(payload._id)
      .then((user) => {
        console.log('user', user);
        if (!user) {
          throwUnauthorizedError();
        }
      });
  } catch (err) {
    res.clearCookie('token');
    throwUnauthorizedError();
  }
  req.user = payload;

  next();
};
