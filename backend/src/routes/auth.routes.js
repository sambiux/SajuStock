const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const manejarValidaciones = require('../middlewares/validacion.middleware');
const { validarLogin, validarRegistro } = require('../validators/auth.validator');

// POST /api/auth/login
router.post('/login', validarLogin, manejarValidaciones, authController.login);

// POST /api/auth/registro (solo admin puede crear usuarios)
router.post(
  '/registro',
  verificarToken,
  verificarRol('admin'),
  validarRegistro,
  manejarValidaciones,
  authController.registrar
);

// GET /api/auth/perfil
router.get('/perfil', verificarToken, authController.perfil);

module.exports = router;
