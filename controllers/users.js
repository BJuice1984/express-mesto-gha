const User = require('../models/user');
const { ErrCodeBadData, ErrCodeServer } = require('../costants/constants');
const NotFoundError = require('../errors/not-found-err');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ErrCodeServer).send({ message: 'Ошибка на сервере' }));
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => { throw new NotFoundError('Ошибка. Данные не корректны'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Пользователь не найден' });
      } else {
        res.status(ErrCodeServer).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  User.create({ name, about, avatar, email, password })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
      } else {
        res.status(ErrCodeServer).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.updateUser = (req, res) => {
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
      } else {
        res.status(ErrCodeServer).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => { throw new NotFoundError('Ошибка. Пользователь не найден'); })
    .then((ava) => res.send(ava))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
      } else {
        res.status(ErrCodeServer).send({ message: 'Ошибка на сервере' });
      }
    });
};
