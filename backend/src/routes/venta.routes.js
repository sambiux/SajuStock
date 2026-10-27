const express = require('express');
const router = express.Router();

const ventaController = require('../controllers/venta.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const manejarValidaciones = require('../middlewares/validacion.middleware');
const { validarCrearVenta, validarIdVenta, validarBusqueda } = require('../validators/venta.validator');

router.use(verificarToken);

router.get('/',           validarBusqueda,  manejarValidaciones, ventaController.listar);
router.get('/:id',        validarIdVenta,   manejarValidaciones, ventaController.obtenerUno);
router.post('/',          validarCrearVenta, manejarValidaciones, ventaController.crear);
router.patch('/:id/anular', validarIdVenta, manejarValidaciones, ventaController.anular);

module.exports = router;