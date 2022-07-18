const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { validateUserBody, validateUserAuth } = require('../middlewares/validations');
const { requestLogger, errorLogger } = require('../middlewares/logger');

router.use(requestLogger);

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateUserAuth, login);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use(errorLogger);

router.use((req, res, next) => {
  next(new NotFoundError('Ой, кажется, такой страницы не существует.. Ошибка!'));
});

module.exports = router;
