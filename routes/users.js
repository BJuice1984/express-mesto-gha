const router = require('express').Router();
const {
  validateUserId, validateUpdateUser, validateUpdateUserAvatar,
} = require('../middlewares/validations');

const {
  getUsers, getUserId, updateUser, updateUserAvatar, getMyProfile,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMyProfile);

router.get('/:userId', validateUserId, getUserId);

router.patch('/me', validateUpdateUser, updateUser);

router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

module.exports = router;
