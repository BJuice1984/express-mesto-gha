const Card = require('../models/card');
const { OkCodeCreated } = require('../costants/constants');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

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
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => { throw new NotFoundError('Ошибка. Карточка не найдена'); })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Ошибка. Нельзя удалить чужую карточку'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Ошибка. Карточка не найдена'); })
    .then((card) => res.status(OkCodeCreated).send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Ошибка. Карточка не найдена'); })
    .then((card) => res.send(card))
    .catch(next);
};
