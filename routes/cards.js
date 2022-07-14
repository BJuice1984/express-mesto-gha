const router = require('express').Router();
const {
  validateCreateCard, validateDeleteCard, validateLikeCard, validateDislikeCard,
} = require('../middlewares/validations');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', validateCreateCard, createCard);

router.delete('/:cardId', validateDeleteCard, deleteCard);

router.put('/:cardId/likes', validateLikeCard, likeCard);

router.delete('/:cardId/likes', validateDislikeCard, dislikeCard);

module.exports = router;
