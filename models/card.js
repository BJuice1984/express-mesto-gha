const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Длина не менее 2-х симоволов, сейчас {VALUE}'],
    maxlength: [30, 'Длина не более 30-ти символов, сейчас {VALUE}'],
  },
  link: {
    type: String,
    required: true,
  },
  owener: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
