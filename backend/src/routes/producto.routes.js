const express = require('express');
const router = express.Router();

const productoController = require('../controllers/producto.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const manejarValidaciones = require('../middlewares/validacion.middleware');
const {
  validarCrearProducto,
  validarActualizarProducto,
  validarIdProducto,
  validarBusqueda,
} = require('../validators/producto.validator');

router.use(verificarToken);

router.get('/stock-bajo', productoController.stockBajo);
router.get('/',    validarBusqueda,          manejarValidaciones, productoController.listar);
router.get('/:id', validarIdProducto,        manejarValidaciones, productoController.obtenerUno);
router.post('/',   validarCrearProducto,     manejarValidaciones, productoController.crear);
router.put('/:id', validarActualizarProducto, manejarValidaciones, productoController.actualizar);
router.delete('/:id', validarIdProducto,    manejarValidaciones, productoController.eliminar);

module.exports = router;