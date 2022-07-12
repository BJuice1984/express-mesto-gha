const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/jwt');
const User = require('../models/user');
const { ErrCodeBadData, OkCodeCreated, ErrCodeConflictEmail } = require('../costants/constants');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizationError = require('../errors/unauth-err');
// const ConflictEmailError = require('../errors/coflict-err');
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getMyProfile = (req, res, next) => {
  console.log(req.user._id);
  const { userId } = req.user.payload;
  User.findById(userId)
    .orFail(() => { throw new NotFoundError('Ошибка. Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
        return;
      }
      next(err);
    });
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params.userId;
  User.findById(userId)
    .orFail(() => { throw new NotFoundError('Ошибка. Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
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
    const error = new Error('Ошибка. Данные не переданы');
    error.statusCode = ErrCodeBadData;
    throw error;
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
        res.status(ErrCodeConflictEmail).send({ message: 'Ошибка. Пользователь с таким email уже зарегистрирован' });
        return;
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
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
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
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  console.log(email);

  if (!email || !password) {
    const error = new Error('Ошибка. Данные не переданы');
    error.statusCode = ErrCodeBadData;
    throw error;
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken({ _id: user._id });
      console.log('gener');
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
