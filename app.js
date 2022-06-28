const express = require('express');
const mongoose = require('mongoose');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const usersRouter = require('./routes/users');

app.use('/', usersRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});