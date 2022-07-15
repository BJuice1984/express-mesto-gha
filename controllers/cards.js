const Card = require('../models/card');
const { OkCodeCreated } = require('../costants/constants');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const BadDataError = require('../errors/bad-data-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(OkCodeCreated).send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      _id: card._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadDataError('Ошибка. Данные не корректны'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => { throw new NotFoundError('Ошибка. Карточка не найдена'); })
    .then((card) => {
      if (card.owner.toHexString() !== req.user._id) {
        throw new ForbiddenError('Ошибка. Нельзя удалить чужую карточку');
      }
      return Card.findOneAndRemove(req.params.cardId)
        .then(() => res.send(card))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadDataError('Ошибка. Данные не корректны'));
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
    .then((card) => res.status(OkCodeCreated).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadDataError('Ошибка. Данные не корректны'));
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
        next(new BadDataError('Ошибка. Данные не корректны'));
        return;
      }
      next(err);
    });
};
