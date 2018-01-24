const mongoose = require('mongoose');

var ModeloDeActividad = new mongoose.Schema({
  _materia: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    minlength: 1,
    validate: {
      isAsync: false,
      validator: isAlphanumeric,
      type: 'isAlphanumeric'
    }
  },
  porcentaje: {
    type: Number,
    required: true,
    validate: {
      isAsync: false,
      validator: isUnder100,
      type: 'isUnder100'
    }
  },
  fecha: {
    type: Date,
    required: false,
    validate: {
      isAsync: false,
      validator: isValidDate,
      type: 'isValidDate'
    }
  },
  nota: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      isAsync: false,
      validator: isUnder20,
      type: 'isUnder20'
    }
  }
});

function isAlphanumeric(v) {
  var regex = /^[\w\s]+$/;
  return regex.test(v);
}

function isUnder20(v) {
  return (v <= 20) && (v >= 0);
}

function isUnder100(v) {
  return (v <= 100) && (v >= 0);
}

function isValidDate(v) {
  var day = v.getDate() + 1;
  var month = v.getMonth();
  var year = v.getFullYear();
  var currentDay = new Date().getDate();
  var currentMonth = new Date().getMonth();
  var currentYear = new Date().getFullYear();

  console.log(`Date: ${day}/${month}/${year}`);
  console.log(`Current date: ${currentDay}/${currentMonth}/${currentYear}`);

  if (year < currentYear) {
    return false;
  } else if ((year == currentYear) && (month < currentMonth)) {
    return false;
  } else if ((month == currentMonth) && (day < currentDay)) {
    return false;
  }
  return true;
}

var Actividad = mongoose.model('Actividad', ModeloDeActividad);

module.exports = {Actividad};
