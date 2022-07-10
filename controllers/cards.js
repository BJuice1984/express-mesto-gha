const Card = require('../models/card');
const { ErrCodeBadData, ErrCodeServer } = require('../costants/constants');
const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ErrCodeServer).send({ message: 'Ошибка на сервере' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owener = req.user._id;
  Card.create({ name, link, owener })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
      } else {
        res.status(ErrCodeServer).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => { throw new NotFoundError('Ошибка. Карточка не найдена'); })
    .then((card) => {
      if (card.owener.toHexString() !== req.user._id) {
        res.status(403).send({ message: 'Ошибка. Нельзя удалить чужую карточку' });
      }
      return Card.findOneAndRemove(req.params.cardId)
        .then(() => res.send(card))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Ошибка. Карточка не найдена'); })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Ошибка. Карточка не найдена'); })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrCodeBadData).send({ message: 'Ошибка. Данные не корректны' });
        return;
      }
      next(err);
    });
};
