const express = require('express');
const router = express.Router();

const authRoutes      = require('./auth.routes');
const productoRoutes  = require('./producto.routes');
const categoriaRoutes = require('./categoria.routes');
const clienteRoutes   = require('./cliente.routes');
const ventaRoutes     = require('./venta.routes');
const dashboardRoutes = require('./dashboard.routes');
const compraRoutes    = require('./compra.routes');
const reporteRoutes   = require('./reporte.routes');
const proveedorRoutes = require('./proveedor.routes');
const usuarioRoutes   = require('./usuario.routes');

router.use('/auth',        authRoutes);
router.use('/productos',   productoRoutes);
router.use('/categorias',  categoriaRoutes);
router.use('/clientes',    clienteRoutes);
router.use('/ventas',      ventaRoutes);
router.use('/dashboard',   dashboardRoutes);
router.use('/compras',     compraRoutes);
router.use('/reportes',    reporteRoutes);
router.use('/proveedores', proveedorRoutes);
router.use('/usuarios',    usuarioRoutes);

module.exports = router;