const express = require('express');
const router = express.Router();

const recuperacionController = require('../controllers/recuperacion.controller');
const manejarValidaciones = require('../middlewares/validacion.middleware');
const { validarSolicitud, validarRestablecer } = require('../validators/recuperacion.validator');

router.post('/solicitar',   validarSolicitud,   manejarValidaciones, recuperacionController.solicitar);
router.post('/restablecer', validarRestablecer, manejarValidaciones, recuperacionController.restablecer);

module.exports = router;