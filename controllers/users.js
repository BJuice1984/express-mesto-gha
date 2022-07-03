const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Ошибка на сервере: ${err.message}` }));
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Ошибка. Данные не корректны' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Ошибка. Пользователь не найден: ${err.message}` });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err.message}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка. Данные не корректны: ${err.message}` });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err.message}` });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Ошибка. Пользователь не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка. Данные не корректны: ${err.message}` });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err.message}` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((ava) => {
      if (!ava) {
        res.status(404).send({ message: 'Ошибка. Пользователь не найден' });
      } else {
        res.send(ava);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка. Данные не корректны: ${err.message}` });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err.message}` });
      }
    });
};
