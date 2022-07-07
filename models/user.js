const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак Ив Кусто',
    minlength: [2, 'Длина не менее 2-х симоволов, сейчас {VALUE}'],
    maxlength: [30, 'Длина не более 30-ти символов, сейчас {VALUE}'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Длина не менее 2-х симоволов, сейчас {VALUE}'],
    maxlength: [30, 'Длина не более 30-ти символов, сейчас {VALUE}'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isUrl(v),
      message: 'Ошибка! Ссылка имеет неправильный формат',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Длина не менее 2-х симоволов, сейчас {VALUE}'],
  },
});

module.exports = mongoose.model('user', userSchema);
