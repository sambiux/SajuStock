const express = require('express');
const router = express.Router();

const compraController = require('../controllers/compra.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const manejarValidaciones = require('../middlewares/validacion.middleware');
const { validarCrearCompra, validarIdCompra, validarBusqueda } = require('../validators/compra.validator');

router.use(verificarToken);

// Todos pueden registrar compras
router.post('/', validarCrearCompra, manejarValidaciones, compraController.crear);

// Todos pueden listar — pero el controller filtra según el rol
router.get('/',    validarBusqueda, manejarValidaciones, compraController.listar);
router.get('/:id', validarIdCompra, manejarValidaciones, compraController.obtenerUno);

module.exports = router;