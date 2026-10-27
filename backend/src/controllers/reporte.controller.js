const reporteService = require('../services/reporte.service');

const productosMasVendidos = async (req, res, next) => {
  try {
    const { fechaDesde, fechaHasta, limite } = req.query;
    const data = await reporteService.reporteProductosMasVendidos({ fechaDesde, fechaHasta, limite });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const productosStockBajo = async (req, res, next) => {
  try {
    const data = await reporteService.reporteProductosStockBajo();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const ventasPorFecha = async (req, res, next) => {
  try {
    const { fechaDesde, fechaHasta } = req.query;
    const data = await reporteService.reporteVentasPorFecha({ fechaDesde, fechaHasta });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const ventasPorCliente = async (req, res, next) => {
  try {
    const { fechaDesde, fechaHasta, limite } = req.query;
    const data = await reporteService.reporteVentasPorCliente({ fechaDesde, fechaHasta, limite });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const resumenInventario = async (req, res, next) => {
  try {
    const data = await reporteService.reporteResumenInventario();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  productosMasVendidos,
  productosStockBajo,
  ventasPorFecha,
  ventasPorCliente,
  resumenInventario,
};