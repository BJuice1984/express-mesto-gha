const Card = require('../models/card');
const { ErrCodeBadData, ErrCodeNotFound, ErrCodeServer } = require('../costants/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owener: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
      } else {
        res.status(ErrCodeServer).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ErrCodeNotFound).send({ message: 'Ошибка. Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
      } else {
        res.status(ErrCodeServer).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ErrCodeNotFound).send({ message: 'Ошибка. Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
      } else {
        res.status(ErrCodeServer).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ErrCodeNotFound).send({ message: 'Ошибка. Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
      } else {
        res.status(ErrCodeServer).send({ message: 'Ошибка на сервере' });
      }
    });
};
