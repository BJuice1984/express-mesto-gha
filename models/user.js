const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Длина не менее 2-х симоволов, сейчас {VALUE}'],
    maxlength: [30, 'Длина не более 30-ти символов, сейчас {VALUE}'],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Длина не менее 2-х симоволов, сейчас {VALUE}'],
    maxlength: [30, 'Длина не более 30-ти символов, сейчас {VALUE}'],
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
