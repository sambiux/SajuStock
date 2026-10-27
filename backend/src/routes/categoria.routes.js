const express = require('express');
const router = express.Router();

const categoriaController = require('../controllers/categoria.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const manejarValidaciones = require('../middlewares/validacion.middleware');
const { validarCrearCategoria } = require('../validators/categoria.validator');

router.use(verificarToken);

router.get('/', categoriaController.listar);
router.post('/', validarCrearCategoria, manejarValidaciones, categoriaController.crear);

module.exports = router;