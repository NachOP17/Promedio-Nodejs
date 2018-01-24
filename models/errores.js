const {Semestre} = require('./semestre');
const validator = require('validator');

var Errores = {

  correcto: {
    codigo: 0,
    mensaje: 'Correcto'
  },

  // Errores del Semestre
  semestreNoIngresado: {
    codigo: 1,
    mensaje: 'El nombre del semestre no puede estar vacío.'
  },
  semestreNoValido: {
    codigo: 2,
    mensaje: 'El nombre del semestre solo puede contener caracteres alfanuméricos.'
  },
  semestreMuyCorto: {
    codigo: 3,
    mensaje: 'El nombre del semestre debe tener como mínimo 4 caracteres.'
  },
  semestreMuyLargo: {
    codigo: 4,
    mensaje: 'El nombre del semestre puede tener como máximo 20 caracteres.'
  },
  idSemestreNoValido: {
    codigo: 5,
    mensaje: 'El semestre donde se quiere registrar la materia no es válido'
  },

  // Errores de las Materias
  materiaNoIngresada: {
    codigo: 6,
    mensaje: 'El nombre de la materia no puede estar vacía.'
  },
  materiaNoValida: {
    codigo: 7,
    mensaje: 'El nombre de la materia solo puede contener caracteres alfanuméricos.'
  },
  materiaMuyCorta: {
    codigo: 8,
    mensaje: 'El nombre de la materia debe tener como mínimo un caracter.'
  },
  materiaMuyLarga: {
    codigo: 9,
    mensaje: 'El nombre de la materia no puede contener más de 50 caracteres.'
  },
  idMateriaNoValido: {
    codigo: 10,
    mensaje: 'La materia en donde se quiere registrar la actividad no es válida.'
  },

  // Errores de las Actividades: {
  nombreActividadNoIngresado: {
    codigo: 11,
    mensaje: 'El nombre de la actividad no puede estar vacío.'
  },
  nombreActividadNoValido: {
    codigo: 12,
    mensaje: 'El nombre de la actividad solo puede contener caracteres alfanuméricos.'
  },
  nombreActividadMuyLargo: {
    codigo: 13,
    mensaje: 'El nombre de la actividad no puede contener más de 50 caracteres.'
  },
  nombreActividadMuyCorto: {
    codigo: 14,
    mensaje: 'El nombre de la actividad debe contener como mínimo 1 caracter.'
  },
  porcentajeActividadNoIngresado: {
    codigo: 15,
    mensaje: 'El porcentaje de la actividad no puede estar vacío.'
  },
  porcentajeActividadNoValido: {
    codigo: 16,
    mensaje: 'El porcentaje de la actividad no puede ser menor a 0% ni mayor a 100%.'
  },
  fechaActividadNoValida: {
    codigo: 17,
    mensaje: 'La fecha de una actividad no puede ser una fecha del pasado.'
  },
  fechaActividadNoTipoDate: {
    codigo: 18,
    mensaje: 'La fecha de la actividad no es de tipo Date.'
  },

  notANumber: {
    codigo: 19,
    mensaje: 'El dato ingresado no es un número.'
  },

  notaActividadNoValida: {
    codigo: 20,
    mensaje: 'La nota no puede ser menor a 0 ni mayor a 20'
  },

  porcentajeMuyAltoActividades: {
    codigo: 21,
    mensaje: 'No se pueden agregar más actividades porque el porcentaje total pasa el 100%'
  },
  promedioMuyAltoMaterias: {
    codigo: 22,
    mensaje: 'No se pueden agregar más materias porque el promedio es mayor a 20'
  },

  // Métodos
  validarRegistroSemestre,
  validarRegistroMateria,
  validarRegistroActividad
}

function validarRegistroSemestre(e) {
  // Valida los errores en la creación de los semestres
  var errores = [];

  var jsonDelError = JSON.stringify(e.errors);

  if (jsonDelError) {
    if (validator.contains(jsonDelError, 'nombre')) {
      validarErroresDeCreacion(e.errors.nombre.kind, Errores.semestroNoIngresado, Errores.semestreNoValido, Errores.semestreMuyCorto, Errores.semestreMuyLargo, errores);
    }
    return errores;
  }
}

function validarRegistroMateria(e) {
  // Valida los errores en la creación de materias
  var errores = [];
  var jsonDelError = JSON.stringify(e.errors);

  if (jsonDelError) {
    if (validator.contains(jsonDelError, 'nombre')) {
      validarErroresDeCreacion(e.errors.nombre.kind, Errores.materiaNoIngresada, Errores.materiaNoValida, Errores.materiaMuyCorta, Errores.materiaMuyLarga, errores);
    }
    return errores;
  }
}

function validarRegistroActividad(e) {
  var errores = [];
  var jsonDelError = JSON.stringify(e.errors);

  if (jsonDelError) {
    if (validator.contains(jsonDelError, 'nombre')) {
      validarErroresDeCreacion(e.errors.nombre.kind, Errores.nombreActividadNoIngresado, Errores.nombreActividadNoValido, Errores.nombreActividadMuyCorto, Errores.nombreActividadMuyLargo, errores)
    }
    if (validator.contains(jsonDelError, 'porcentaje')) {
      validarErroresDeCreacion(e.errors.porcentaje.kind, Errores.porcentajeActividadNoIngresado, Errores.porcentajeActividadNoValido, Errores.notANumber, null, errores);
    }
    if (validator.contains(jsonDelError, 'fecha')) {
      validarErroresDeCreacion(e.errors.fecha.kind, Errores.fechaActividadNoTipoDate, Errores.fechaActividadNoValida, null, null, errores);
    }
    if (validator.contains(jsonDelError, 'nota')) {
      validarErroresDeCreacion(e.errors.nota.kind, null, Errores.notaActividadNoValida, null, null, errores);
    }
    return errores;
  }
}

function validarErroresDeCreacion(kind, noIngresado, noValido, muyCorto, muyLargo, errores) {
  // Ve cuales errores están presentes al momento de la creación de algún modelo y los mete en un arreglo de errores
  switch(kind) {
    case 'required': errores.push(noIngresado);
      break;
    case 'isAlphanumeric': errores.push(noValido);
      break;
    case 'minlength': errores.push(muyCorto);
      break;
    case 'maxlength': errores.push(muyLargo);
      break;
    case 'isUnder100': errores.push(noValido);
      break;
    case 'Number': errores.push(muyCorto);
      break;
    case 'isValidDate': errores.push(noValido);
      break;
    case 'Date': errores.push(noIngresado);
      break;
    case 'isUnder20': errores.push(noValido);
      break;
  }
}

module.exports = {Errores}
