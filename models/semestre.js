const mongoose = require('mongoose');

var ModeloDeSemestre = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
    minlength: 1,
    validate: {
      isAsync: false,
      validator: isAlphanumeric,
      type: 'isAlphanumeric'
    }
  },
  promedioAcumulado: {
    type: Number,
    required: true,
    default: 0
  }
});

function isAlphanumeric(v) {
  var regex = /^[\w\s]+$/;
  return regex.test(v);
}


var Semestre = mongoose.model('Semestre', ModeloDeSemestre);

module.exports = {Semestre};
