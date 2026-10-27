const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const manejarValidaciones = require('../middlewares/validacion.middleware');
const {
  validarCrearUsuario,
  validarActualizarUsuario,
  validarCambiarPassword,
  validarIdUsuario,
} = require('../validators/usuario.validator');

router.use(verificarToken);

// Cualquier usuario autenticado puede cambiar su propia contraseña
router.patch('/cambiar-password', validarCambiarPassword, manejarValidaciones, usuarioController.cambiarPassword);

// Solo admin puede gestionar usuarios
router.get('/',              verificarRol('admin'),                                             usuarioController.listar);
router.post('/',             verificarRol('admin'), validarCrearUsuario,    manejarValidaciones, usuarioController.crear);
router.put('/:id',           verificarRol('admin'), validarActualizarUsuario, manejarValidaciones, usuarioController.actualizar);
router.patch('/:id/toggle',  verificarRol('admin'), validarIdUsuario,        manejarValidaciones, usuarioController.toggleActivo);

module.exports = router;