const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { linkRegex } = require('../costants/constants');

const router = express.Router();
const {
  getUsers, getUserId, updateUser, updateUserAvatar, getMyProfile,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMyProfile);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().hex().length(24),
  }),
}), getUserId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .regex(linkRegex),
  }),
}), updateUserAvatar);

module.exports = router;
