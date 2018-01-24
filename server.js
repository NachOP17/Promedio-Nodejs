require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Semestre} = require('./models/semestre');
var {Materia} = require('./models/materia');
var {Actividad} = require('./models/actividad');
var {Errores} = require('./models/errores');

var app = express();
var port = process.env.PORT;

app.use(bodyParser.json());

//                SEMESTRE
// Crear Semestre
app.post('/semestres', (req, res) => {
  var semestre = new Semestre({nombre: req.body.nombre});
  var errores = [];
  semestre.save().then(() => {
    res.status(200).send({semestre});
  }).catch((e) => {
    errores = Errores.validarRegistroSemestre(e);
    res.status(400).send({errores});
  });
});

// Obtener todos los semestres
app.get('/semestres', (req, res) => {
  Semestre.find({}).then((semestres) => {
    res.status(200).send({semestres});
  }, (e) => {
    res.status(400).send(e);
  });
});


//                MATERIA
// Crear Materia
app.post('/materias', (req, res) => {
  if (req.body._semestre != undefined) {
    Semestre.find({_id: req.body._semestre}).then((semestre) => {
      var materia = new Materia({
        _semestre: semestre[0]._id,
        nombre: req.body.nombre,
        notaAcumulada: req.body.nota
      });
      var errores = [];

      materia.save().then(() => {
        console.log('Agregando Materia');
        calcularPromedioMaterias(semestre[0]._id, res, materia)
      }).catch((e) => {
        errores = Errores.validarRegistroMateria(e);
        res.status(400).send({errores});
      });
    }).catch((e) => {
      res.status(400).send(Errores.idSemestreNoValido);
    });
  } else {
    res.status(400).send(Errores.idSemestreNoValido);
  }
});

// Obtener Materias
app.get('/materias/:semestre', (req, res) => {
  Materia.find({
    _semestre: req.params.semestre
  }).then((materias) => {
    res.status(200).send({materias});
  }, (e) => {
    res.status(400).send(Errores.idSemestreNoValido);
  });
});


//                ACTIVIDAD
// Crear Actividad
app.post('/actividades', (req, res) => {
  if (req.body._materia != undefined) {
    Materia.find({_id: req.body._materia}).then((materia) => {
      var actividad = new Actividad({
        _materia: materia[0]._id,
        nombre: req.body.nombre,
        porcentaje: req.body.porcentaje,
        fecha: req.body.fecha,
        nota: req.body.nota
      });
      var errores = [];

      actividad.save().then(() => {
        console.log('Agregando actividad');
        calcularPromedioActividades(materia[0]._id, res, actividad);
      }).catch((e) => {
        errores = Errores.validarRegistroActividad(e);
        res.status(400).send(e);
      });
    }).catch((e) => {
      res.status(400).send(Errores.idMateriaNoValido);
    });
  } else {
    res.status(400).send(Errores.idMateriaNoValido);
  }
});





//    METODOS!!
function calcularPromedioActividades(id, res, actividad) {
  var promedio = 0;
  var porcentajeTotal = 0;

  console.log('Calculando Promedio');

  if (id != null) {
    Actividad.find({_materia: id}).then((actividades) => {
      var length = actividades.length;
      console.log('Longitud: ' + length);
      for (var i = 0; i < length; i++) {
        porcentajeTotal += actividades[i].porcentaje;
      }
      console.log(porcentajeTotal);

      if (porcentajeTotal <= 100) {
        Materia.find({_id: id}).then((materia) => {
          promedio = materia[0].notaAcumulada + (actividad.nota * (actividad.porcentaje/100));
          Materia.findOneAndUpdate({
            _id: id
          }, {
            $set: {
              notaAcumulada: promedio
            }
          }, {new: true}).then(() => {
            console.log('Se guardó el promedio');
            json = {actividad}
            json["promedioAcumulado"] = promedio;
            res.status(200).send(json);
          }).catch((e) => {
            res.send(e);
          });
        }).catch((e) => {
          res.send(e);
        })
      } else {
        res.status(400).send(Errores.porcentajeMuyAltoActividades);
      }
    }).catch((e) => {
      res.send(e);
    });
  } else {
    res.send(e);
  }
};

function calcularPromedioMaterias(id, res, materia) {
  var promedio = 0;

  console.log('Calculando Promedio');

  if (id != null) {
    Materia.find({_semestre: id}).then((materias) => {
      var length = materias.length;
      console.log('Longitud: ' + length);
      Semestre.find({_id: id}).then((semestre) => {
        if (length == 1) {
          promedio = materia.notaAcumulada;
        } else {
          promedio = (semestre[0].promedioAcumulado + materia.notaAcumulada) / 2;
        }
        console.log(`Promedio = ${promedio}`);
        if (promedio <= 20) {
          Semestre.findOneAndUpdate({
            _id: id
          }, {
            $set: {
              promedioAcumulado: promedio
            }
          }, {new: true}).then(() => {
            console.log('Se guardó el promedio');
            json = {materia}
            json["promedioAcumulado"] = promedio;
            res.status(200).send(json);
          }).catch((e) => {
            res.send(e);
          });
        } else {
        res.status(400).send(Errores.promedioMuyAltoMaterias);
        }
      }).catch((e) => {
        res.send(e);
      });
    }).catch((e) => {
      res.send(e);
    });
  } else {
    res.send(e);
  }
};




app.listen(port, () => {
  console.log(`El servidor está en el puerto ${port}`);
});

module.exports = {app};
