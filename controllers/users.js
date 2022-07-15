const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/jwt');
const User = require('../models/user');
const { OkCodeCreated } = require('../costants/constants');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizationError = require('../errors/unauth-err');
const BadDataError = require('../errors/bad-data-err');
const ConflictEmailError = require('../errors/coflict-err');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getMyProfile = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => { throw new NotFoundError('Ошибка. Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadDataError('Ошибка. Данные не корректны'));
        return;
      }
      next(err);
    });
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => { throw new NotFoundError('Ошибка. Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadDataError('Ошибка. Данные не корректны'));
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new BadDataError('Ошибка. Данные не переданы');
  }

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(OkCodeCreated).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictEmailError('Ошибка. Пользователь с таким email уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => { throw new NotFoundError('Ошибка. Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadDataError('Ошибка. Данные не корректны'));
        return;
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => { throw new NotFoundError('Ошибка. Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadDataError('Ошибка. Данные не корректны'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadDataError('Ошибка. Данные не переданы');
  }

  return User.findUserByCredentials(email, password)
    .then((user) => generateToken({ _id: user._id }))
    .then((token) => {
      res.cookie('jwt', token, {
        maxAge: 3600000 * 7 * 24,
        httpOnly: true,
        sameSite: true,
      })
        .send({ token });
    })
    .catch(() => {
      next(new UnauthorizationError('Ошибка. Неправильные почта или пароль'));
    });
};
