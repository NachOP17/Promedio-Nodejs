const mongoose = require('mongoose');
const {Actividad} = require('./actividad');

var ModeloDeMateria = new mongoose.Schema({
  _semestre: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  nombre: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    trim: true,
    validate: {
      isAsync: false,
      validator: isAlphanumeric,
      type: isAlphanumeric
    }
  },
  porcentajeEvaluado: {
    type: Number,
    required: true,
    default: 0
  },
  notaAcumulada: {
    type: Number,
    required: true,
    default: 0
  }
});

function isAlphanumeric(v) {
  var regex = /^[\w\sáéíóú,-]+$/;
  return regex.test(v);
}

var Materia = mongoose.model('Materia', ModeloDeMateria);

module.exports = {Materia};
