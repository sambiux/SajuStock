const express = require('express');
const router = express.Router();

const proveedorController = require('../controllers/proveedor.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const manejarValidaciones = require('../middlewares/validacion.middleware');
const {
  validarCrearProveedor,
  validarActualizarProveedor,
  validarIdProveedor,
  validarBusqueda,
} = require('../validators/proveedor.validator');

// Todas las rutas de proveedores solo para admin
router.use(verificarToken);
router.use(verificarRol('admin'));

router.get('/',    validarBusqueda,             manejarValidaciones, proveedorController.listar);
router.get('/:id', validarIdProveedor,          manejarValidaciones, proveedorController.obtenerUno);
router.post('/',   validarCrearProveedor,        manejarValidaciones, proveedorController.crear);
router.put('/:id', validarActualizarProveedor,  manejarValidaciones, proveedorController.actualizar);
router.delete('/:id', validarIdProveedor,       manejarValidaciones, proveedorController.eliminar);

module.exports = router;