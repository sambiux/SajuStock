const express = require('express');
const router = express.Router();

const reporteController = require('../controllers/reporte.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const manejarValidaciones = require('../middlewares/validacion.middleware');
const { validarRangoFechas } = require('../validators/reporte.validator');

router.use(verificarToken);
router.use(verificarRol('admin'));

router.get('/productos-mas-vendidos', validarRangoFechas, manejarValidaciones, reporteController.productosMasVendidos);
router.get('/stock-bajo',             reporteController.productosStockBajo);
router.get('/ventas-por-fecha',       validarRangoFechas, manejarValidaciones, reporteController.ventasPorFecha);
router.get('/ventas-por-cliente',     validarRangoFechas, manejarValidaciones, reporteController.ventasPorCliente);
router.get('/resumen-inventario',     reporteController.resumenInventario);

module.exports = router;