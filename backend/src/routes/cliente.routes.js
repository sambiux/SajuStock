const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/cliente.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const manejarValidaciones = require('../middlewares/validacion.middleware');
const {
  validarCrearCliente,
  validarActualizarCliente,
  validarIdCliente,
  validarBusqueda,
} = require('../validators/cliente.validator');

router.use(verificarToken);

router.get('/',              validarBusqueda,          manejarValidaciones, clienteController.listar);
router.get('/:id',           validarIdCliente,         manejarValidaciones, clienteController.obtenerUno);
router.get('/:id/historial', validarIdCliente,         manejarValidaciones, clienteController.historial);
router.post('/',             validarCrearCliente,      manejarValidaciones, clienteController.crear);
router.put('/:id',           validarActualizarCliente, manejarValidaciones, clienteController.actualizar);
router.delete('/:id',        validarIdCliente,         manejarValidaciones, clienteController.eliminar);

module.exports = router;