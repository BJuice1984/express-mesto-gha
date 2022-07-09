const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const { ErrCodeNotFound } = require('./costants/constants');

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = { _id: '62bcc099c7cc326a53a6e343' }; // вставьте сюда _id созданного в предыдущем пункте пользователя
  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res) => res.status(ErrCodeNotFound).send({ message: 'Ой, кажется, такой страницы не существует.. Ошибка!' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
